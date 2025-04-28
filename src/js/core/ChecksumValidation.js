import CurateWorkerManager from "./WorkerManager.js"; // Ensure path is correct

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function updateMetaField(uuid, namespace, value) {
  const url = "/a/user-meta/update";
  const metadatas = {
    MetaDatas: [
      {
        NodeUuid: uuid,
        Namespace: namespace,

        JsonValue: JSON.stringify(value),

        Policies: [
          { Action: "READ", Effect: "allow", Subject: "*" },
          { Action: "WRITE", Effect: "allow", Subject: "*" },
        ],
      },
    ],
    Operation: "PUT",
  };

  Curate.api.fetchCurate(url, "PUT", metadatas);
  console.log(`Attempted to update metadata '${namespace}' for UUID ${uuid}`);
}

function fetchCurateStats(filePath, expectedChecksum, retryCount) {
  Curate.api
    .fetchCurate("/a/tree/stats", "POST", {
      NodePaths: [filePath],
    })
    .then((data) => {
      const node = data.Nodes.find((node) => node.Path === filePath);
      if (node) {
        // If node data is found, proceed to validate its checksum.
        validateChecksum(node, expectedChecksum, filePath, retryCount);
      } else {
        // Handle case where the specific node wasn't found in the API response.
        // This might happen if path construction failed or the node doesn't exist.
        console.error("Node not found in stats response:", filePath);
        // Consider updating meta here to indicate a lookup failure if desired.
      }
    })
    .catch((error) => {
      // Handle errors during the API call itself (network issues, server errors).
      console.error("Error fetching node stats:", error, filePath);
      // Consider retrying or updating meta based on the error type if desired.
    });
}

function validateChecksum(node, expectedChecksum, filePath, retryCount) {
  const maxRetries = 3; // Max number of retries for 'temporary' Etag state.
  const retryDelay = 2000; // Delay in ms before retrying.

  // The backend might return 'temporary' if its Etag calculation isn't finished.
  // Retry fetching stats a few times if this occurs.
  if (node.Etag === "temporary" && retryCount < maxRetries) {
    console.log(
      `Checksum temporary for ${filePath}. Retrying (${
        retryCount + 1
      }/${maxRetries})...`
    );
    setTimeout(() => {
      fetchCurateStats(filePath, expectedChecksum, retryCount + 1);
    }, retryDelay);
  } else if (node.Etag === expectedChecksum) {
    // Checksum matches the expected value.
    console.log(`Checksum validation passed for ${filePath}.`);
    updateMetaField(
      node.Uuid,
      "usermeta-file-integrity", // Namespace for integrity status
      "✓ Integrity verified"
    );
  } else {
    // Checksum mismatch, or max retries for 'temporary' reached.
    console.error(
      `Checksum validation FAILED for ${filePath}.`,
      "Expected:",
      expectedChecksum,
      "Received:",
      node.Etag,
      `(Attempt ${retryCount + 1})`
    );
    updateMetaField(
      node.Uuid,
      "usermeta-file-integrity",
      "X Integrity compromised" // Status indicating failure
    );
  }
}

window.addEventListener("load", () => {
  (async () => {
    // Wait for UploaderModel to be defined, polling every 100ms.
    // Necessary because browser script load order might not be guaranteed.
    while (typeof UploaderModel === "undefined" || !UploaderModel.UploadItem) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const workerManager = new CurateWorkerManager();
    console.log("WorkerManager initialized");

    // Store the original uploadPresigned function before we override its prototype.
    const originalUploadPresigned =
      UploaderModel.UploadItem.prototype.uploadPresigned;

    // Override the uploadPresigned method to inject client-side checksum calculation
    // and validation after the actual upload completes.
    UploaderModel.UploadItem.prototype.uploadPresigned = function () {
      // Execute the original upload logic first. This returns a promise.
      const originalPromise = originalUploadPresigned.apply(this, arguments);

      const multipartDecisionThreshold = PydioApi.getMultipartThreshold();
      const multipartPartSize = PydioApi.getMultipartPartSize();

      // Define an observer function to react to the upload status changes.
      // This waits for the upload to complete ('loaded') before running checksum logic.
      const observer = async (status) => {
        if (status === "loaded") {
          // Remove this specific observer instance from the item's observers
          // to prevent it from running multiple times if the status were to change again.
          if (this._observers && this._observers.status) {
            const index = this._observers.status.indexOf(observer);
            if (index > -1) {
              this._observers.status.splice(index, 1);
            }
          }

          try {
            let finalChecksum;
            // Calculate checksum: use multipart calculation for large files, single MD5 for smaller ones.
            if (this._file.size > multipartDecisionThreshold) {
              // Multipart checksum logic:
              // 1. Calculate MD5 for each part.
              // 2. Concatenate the *binary* digests of each part's MD5.
              // 3. Calculate the MD5 of the concatenated binary digests.
              // 4. Append '-{numberOfParts}' to the final hex MD5 string.
              console.log(
                "File exceeds multipart threshold, generating part checksums for:",
                this._label
              );
              const partSize = multipartPartSize;
              const parts = Math.ceil(this._file.size / partSize);
              const partChecksumsHex = []; // Store hex for potential debugging
              // Allocate space for concatenated *binary* MD5 digests (16 bytes per digest).
              const partDigestsBinary = new Uint8Array(16 * parts);

              for (let i = 0; i < parts; i++) {
                const start = i * partSize;
                const end = Math.min(start + partSize, this._file.size);
                const blob = this._file.slice(start, end);
                const checksumData = await workerManager.generateChecksum(blob);
                partChecksumsHex.push(checksumData.hash);

                // Convert the hex checksum to bytes and add it to the concatenated array.
                const digestBytes = hexToBytes(checksumData.hash);
                partDigestsBinary.set(digestBytes, i * 16);
              }

              const digestBlob = new Blob([partDigestsBinary]);
              const finalChecksumData = await workerManager.generateChecksum(
                digestBlob
              );
              finalChecksum = `${finalChecksumData.hash}-${parts}`; // Append part count

              console.log(
                "Generated multipart checksum:",
                finalChecksum,
                "Parts:",
                parts
              );
            } else {
              // Single part checksum calculation for smaller files.
              console.log(
                "File below multipart threshold, generating single checksum for:",
                this._label
              );
              const checksumData = await workerManager.generateChecksum(
                this._file
              );
              finalChecksum = checksumData.hash;
              console.log("Generated single checksum:", finalChecksum);
            }

            // This logic determines the correct path to query for stats, accounting for
            // potential server-side renaming on filename collision (e.g., file.txt -> file-1.txt).
            const workspace = Curate.workspaces.getOpenWorkspace();
            const targetPath = this._targetNode._path; // Path of the destination folder.
            const relativeFilePath = this._file.webkitRelativePath; // Original path *within* an uploaded folder structure, or "" for single files.
            const finalLabel = this._label; // This property is updated by the UploaderModel to reflect the FINAL filename after potential renaming.

            // Normalize workspace and target paths to ensure correct slash handling.
            const normWorkspace = workspace.endsWith("/")
              ? workspace
              : workspace + "/";
            let normTarget = "";
            if (targetPath && targetPath !== "/") {
              // Handle root path '/'
              normTarget = targetPath.replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes
            }

            let fileComponent = "";
            // Check if a folder structure was uploaded (relativeFilePath is not empty).
            if (relativeFilePath) {
              // Combine the original directory structure from relativeFilePath with the FINAL filename from finalLabel.
              const lastSlashIndex = relativeFilePath.lastIndexOf("/");
              if (lastSlashIndex !== -1) {
                // Extract the directory part (e.g., "folder/subfolder/")
                const dirPart = relativeFilePath.substring(
                  0,
                  lastSlashIndex + 1
                );
                fileComponent = dirPart + finalLabel; // Append the final filename
              } else {
                // Relative path contained only the original filename, so just use the final label.
                fileComponent = finalLabel;
              }
              // Ensure no leading slash inherited from relativeFilePath.
              if (fileComponent.startsWith("/")) {
                fileComponent = fileComponent.substring(1);
              }
            } else {
              // Single file upload, use the final label directly as the file component.
              fileComponent = finalLabel;
            }

            // Combine all parts into the final path.
            let filename = normWorkspace;
            if (normTarget) {
              filename += normTarget + "/"; // Add normalized target path if not root
            }
            filename += fileComponent; // Add the final file/path component
            filename = filename.replace(/\/+/g, "/"); // Clean up any resulting double slashes.

            console.log("Constructed final path for stats API:", filename);

            // Introduce a small delay before fetching stats.
            // Delay scales slightly with file size but is capped.
            const delay = Math.min(5000, Math.max(500, this._file.size * 0.01));
            setTimeout(() => {
              // Initiate the checksum validation process using the final path.
              fetchCurateStats(filename, finalChecksum, 0);
            }, delay);
          } catch (error) {
            console.error(
              "Client-side checksum generation or path construction failed:",
              error
            );
          }
        }
      };

      // Ensure the necessary observer structure exists on the upload item.
      if (!this._observers) this._observers = {};
      if (!this._observers.status) this._observers.status = [];
      // Add the observer to the status listeners, basic check to avoid duplicates.
      if (!this._observers.status.includes(observer)) {
        this._observers.status.push(observer);
      }

      // Return the original promise to allow standard promise chaining and behavior.
      return originalPromise;
    };
  })();
});
