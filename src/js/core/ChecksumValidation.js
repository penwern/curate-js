import CurateWorkerManager from "./WorkerManager.js";

window.addEventListener("load", () => {
  (async () => {
    // Wait for UploaderModel to be defined, polling every 100ms.
    // This is necessary because script load order might not be guaranteed.
    while (typeof UploaderModel === "undefined") {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const workerManager = new CurateWorkerManager();
    console.log("WorkerManager initialized");

    // Store original function before overriding
    const originalUploadPresigned =
      UploaderModel.UploadItem.prototype.uploadPresigned;

    // Helper function to convert a hexadecimal string to a Uint8Array.
    // Needed for processing MD5 digests from part checksums.
    function hexToBytes(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      return bytes;
    }

    // Override the uploadPresigned method to inject checksum validation logic.
    UploaderModel.UploadItem.prototype.uploadPresigned = function () {
      // Call the original upload function first.
      const originalPromise = originalUploadPresigned.apply(this, arguments);
      // Get the file size threshold above which multipart checksum calculation is triggered.
      const multipartDecisionThreshold = PydioApi.getMultipartThreshold();
      // Get the size for each part when doing multipart checksums.
      const multipartPartSize = PydioApi.getMultipartPartSize();

      // Define an observer function to react to the upload status changes.
      const observer = async (status) => {
        // We only care about the 'loaded' status, indicating upload completion.
        if (status === "loaded") {
          // Remove this observer once it has executed.
          this._observers.status.forEach((obs, index) => {
            if (obs === observer) this._observers.status.splice(index, 1);
          });

          try {
            let finalChecksum;
            // Determine if the file size warrants multipart checksum calculation.
            if (this._file.size > multipartDecisionThreshold) {
              console.log(
                "File exceeds multipart threshold, generating part checksums"
              );
              const partSize = multipartPartSize; // Use the defined part size.
              const parts = Math.ceil(this._file.size / partSize);
              const partChecksums = [];
              // Allocate space for concatenated MD5 digests (16 bytes per digest).
              const partDigests = new Uint8Array(16 * parts);

              // Calculate MD5 checksum for each part using the WorkerManager.
              for (let i = 0; i < parts; i++) {
                const start = i * partSize;
                const end = Math.min(start + partSize, this._file.size);
                const blob = this._file.slice(start, end);
                const checksumData = await workerManager.generateChecksum(blob);
                partChecksums.push(checksumData.hash);

                // Convert the hex checksum to bytes and add it to the concatenated array.
                const digestBytes = hexToBytes(checksumData.hash);
                partDigests.set(digestBytes, i * 16);
              }

              // Calculate the final ETag-style checksum: MD5 of the concatenated part digests,
              // followed by '-{numberOfParts}'.
              const digestBlob = new Blob([partDigests]);
              const finalChecksumData = await workerManager.generateChecksum(
                digestBlob
              );
              finalChecksum = `${finalChecksumData.hash}-${parts}`;

              console.log("Generated multipart checksum:", finalChecksum);
            } else {
              // For files below the threshold, calculate a single MD5 checksum for the entire file.
              console.log(
                "File below multipart threshold, generating single checksum"
              );
              const checksumData = await workerManager.generateChecksum(
                this._file
              );
              finalChecksum = checksumData.hash;
            }

            // Introduce a small delay before fetching stats, potentially allowing backend processing.
            // Delay scales slightly with file size but capped between 0.5s and 5s.
            const delay = Math.min(5000, Math.max(500, this._file.size * 0.01));
            setTimeout(() => {
              // Construct the full file path required by the stats API.
              const p = this._targetNode._path;
              const pathSuffix = p.endsWith("/") ? "" : "/";
              const parentLabelPart = this._parent._label
                ? `${this._parent._label}/`
                : "";
              const filename = `${Curate.workspaces.getOpenWorkspace()}${p}${pathSuffix}${parentLabelPart}${
                this._label
              }`;
              // Initiate the checksum validation process.
              fetchCurateStats(filename, finalChecksum, 0);
            }, delay);
          } catch (error) {
            console.error("Checksum generation failed:", error);
          }
        }
      };

      // Register the observer to listen for status changes on this upload item.
      this._observers.status.push(observer);
      // Return the original promise from the upload function.
      return originalPromise;
    };

    // Fetches file stats from the backend API.
    function fetchCurateStats(filePath, expectedChecksum, retryCount) {
      Curate.api
        .fetchCurate("/a/tree/stats", "POST", {
          NodePaths: [filePath],
        })
        .then((data) => {
          const node = data.Nodes.find((node) => node.Path === filePath);
          if (node) {
            // Once stats are fetched, proceed to validate the checksum.
            validateChecksum(node, expectedChecksum, filePath, retryCount);
          } else {
            // Handle case where the specific node is not found in the API response.
            console.error("Node not found in response:", filePath);
            // Consider updating meta here to indicate a lookup failure.
          }
        })
        .catch((error) => {
          // Handle errors during the API call itself.
          console.error("Error fetching node stats:", error);
          // Consider retrying or updating meta here based on the error.
        });
    }

    // Validates the checksum (Etag) from the node stats against the calculated checksum.
    function validateChecksum(node, expectedChecksum, filePath, retryCount) {
      const maxRetries = 3;
      // The backend might return 'temporary' if the Etag calculation isn't finished.
      // Retry fetching stats a few times if this occurs.
      if (node.Etag === "temporary" && retryCount < maxRetries) {
        console.log(
          `Checksum temporary for ${filePath}. Retrying (${
            retryCount + 1
          }/${maxRetries})...`
        );
        setTimeout(() => {
          fetchCurateStats(filePath, expectedChecksum, retryCount + 1);
        }, 2000); // Wait 2 seconds before retrying.
      } else if (node.Etag === expectedChecksum) {
        // Checksum matches the expected value.
        console.log(`Checksum validation passed for ${filePath}.`);
        updateMetaField(
          node.Uuid,
          "usermeta-file-integrity",
          "✓ Integrity verified"
        );
      } else {
        // Checksum mismatch or max retries for 'temporary' reached.
        console.error(
          `Checksum validation failed for ${filePath}.`,
          "Expected:",
          expectedChecksum,
          "Received:",
          node.Etag,
          `(Attempt ${retryCount + 1})`
        );
        updateMetaField(
          node.Uuid,
          "usermeta-file-integrity",
          "X Integrity compromised"
        );
      }
    }

    // Updates a specific user metadata field for a given node UUID.
    function updateMetaField(uuid, namespace, value) {
      const url = "/a/user-meta/update";
      const metadatas = {
        MetaDatas: [
          {
            NodeUuid: uuid,
            Namespace: namespace,
            // Ensure the value is JSON stringified for the API.
            JsonValue: JSON.stringify(value),
            // Define policies for read/write access to this metadata; '*' allows all.
            Policies: [
              { Action: "READ", Effect: "allow", Subject: "*" },
              { Action: "WRITE", Effect: "allow", Subject: "*" },
            ],
          },
        ],
        Operation: "PUT", // Use PUT operation to set/update the metadata.
      };
      // Use the Curate API helper to send the update request.
      // Intentionally not awaiting or chaining .then/.catch here - fire and forget.
      // Consider adding error handling if confirmation of meta update is needed.
      Curate.api.fetchCurate(url, "PUT", metadatas);
      console.log(
        `Attempted to update metadata '${namespace}' for UUID ${uuid}`
      );
    }
  })();
});
