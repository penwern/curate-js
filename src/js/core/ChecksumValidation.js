import CurateWorkerManager from "./WorkerManager.js";

window.addEventListener("load", () => {
  (async () => {
    while (typeof UploaderModel === "undefined") {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const workerManager = new CurateWorkerManager();
    console.log("WorkerManager initialized");

    const originalUploadPresigned =
      UploaderModel.UploadItem.prototype.uploadPresigned;

    UploaderModel.UploadItem.prototype.uploadPresigned = function () {
      const originalPromise = originalUploadPresigned.apply(this, arguments);
      const multipartThreshold = PydioApi.getMultipartPartSize();

      const observer = async (status) => {
        if (status === "loaded") {
          this._observers.status.forEach((obs, index) => {
            if (obs === observer) this._observers.status.splice(index, 1);
          });

          try {
            let finalChecksum;
            if (this._file.size > multipartThreshold) {
              console.log(
                "File exceeds multipart threshold, generating part checksums"
              );
              const partSize = multipartThreshold;
              const parts = Math.ceil(this._file.size / partSize);
              const partChecksums = [];

              for (let i = 0; i < parts; i++) {
                const start = i * partSize;
                const end = Math.min(start + partSize, this._file.size);
                const blob = this._file.slice(start, end);
                const checksumData = await workerManager.generateChecksum(blob);
                partChecksums.push(checksumData.hash);
              }

              // Concatenate all part checksums and generate final checksum
              const concatenatedChecksums = partChecksums.join("");
              const concatenatedBlob = new Blob([concatenatedChecksums]);
              const finalChecksumData = await workerManager.generateChecksum(
                concatenatedBlob
              );
              finalChecksum = finalChecksumData.hash;

              console.log("Generated multipart checksum:", finalChecksum);
            } else {
              console.log(
                "File below multipart threshold, generating single checksum"
              );
              const checksumData = await workerManager.generateChecksum(
                this._file
              );
              finalChecksum = checksumData.hash;
            }

            const delay = Math.min(5000, Math.max(500, this._file.size * 0.01));
            setTimeout(() => {
              const p = this._targetNode._path;
              const pathSuffix = p.endsWith("/") ? "" : "/";
              const parentLabelPart = this._parent._label
                ? `${this._parent._label}/`
                : "";
              const filename = `${Curate.workspaces.getOpenWorkspace()}${p}${pathSuffix}${parentLabelPart}${
                this._label
              }`;
              fetchCurateStats(filename, finalChecksum, 0);
            }, delay);
          } catch (error) {
            console.error("Checksum generation failed:", error);
          }
        }
      };

      this._observers.status.push(observer);
      return originalPromise;
    };

    function fetchCurateStats(filePath, expectedChecksum, retryCount) {
      Curate.api
        .fetchCurate("/a/tree/stats", "POST", {
          NodePaths: [filePath],
        })
        .then((data) => {
          const node = data.Nodes.find((node) => node.Path === filePath);
          if (node) {
            validateChecksum(node, expectedChecksum, filePath, retryCount);
          } else {
            console.error("Node not found in response:", filePath);
          }
        })
        .catch((error) => {
          console.error("Error fetching node stats:", error);
        });
    }

    function validateChecksum(node, expectedChecksum, filePath, retryCount) {
      const maxRetries = 3;
      if (node.Etag === "temporary" && retryCount < maxRetries) {
        console.log("Checksum temporary. Retrying...");
        setTimeout(() => {
          fetchCurateStats(filePath, expectedChecksum, retryCount + 1);
        }, 2000);
      } else if (node.Etag === expectedChecksum) {
        console.log("Checksum validation passed.");
        updateMetaField(
          node.Uuid,
          "usermeta-file-integrity",
          "✓ Integrity verified"
        );
      } else {
        console.error(
          "Checksum validation failed.",
          "Expected:",
          expectedChecksum,
          "Received:",
          node.Etag
        );
        updateMetaField(
          node.Uuid,
          "usermeta-file-integrity",
          "X Integrity compromised"
        );
      }
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
              {
                Action: "READ",
                Effect: "allow",
                Subject: "*",
              },
              {
                Action: "WRITE",
                Effect: "allow",
                Subject: "*",
              },
            ],
          },
        ],
        Operation: "PUT",
      };
      Curate.api.fetchCurate(url, "PUT", metadatas);
    }
  })();
});
