import CurateWorkerManager from './WorkerManager.js';

window.addEventListener("load", () => {
    (async () => {
        // Wait until UploaderModel is defined
        while (typeof UploaderModel === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms before checking again
        }

        const workerManager = new CurateWorkerManager();

        // Save the original uploadPresigned method to call it later
        const originalUploadPresigned = UploaderModel.UploadItem.prototype.uploadPresigned;

        // Monkey patch the uploadPresigned method to include checksum generation and further processing
        UploaderModel.UploadItem.prototype.uploadPresigned = function() {
            console.log('Quarantine Upload: ', this);

            // Generate the checksum for the file
            return workerManager.generateChecksum(this._file)
                .then(checksumData => {
                    console.log('Generated checksum data:', checksumData);

                    // Calculate a delay based on the file's size, with a maximum delay limit
                    const delay = Math.min(5000, Math.max(500, this._file.size * 0.01)); // 10 milliseconds per KB, max 5 seconds, min 500 milliseconds

                    // Use a timeout to delay the fetch stats call
                    setTimeout(() => {
                        // Construct the file path for the stats fetching
                        const p = this._targetNode._path;
                        const pathSuffix = p.endsWith('/') ? '' : '/';
                        const parentLabelPart = this._parent._label ? `${this._parent._label}/` : '';
                        const filename = `quarantine${p}${pathSuffix}${parentLabelPart}${this._label}`;
                        fetchCurateStats(filename, checksumData.hash, 0); // Add initial retry count as 0
                    }, delay);
                })
                .catch(error => {
                    console.error('Checksum generation failed:', error);
                });

            // Continue with the original uploadPresigned behavior
            return originalUploadPresigned.apply(this, arguments);
        };

        // Function to fetch stats from Curate API
        function fetchCurateStats(filePath, expectedChecksum, retryCount) {
            Curate.api.fetchCurate("/a/tree/stats", "POST", {
                "NodePaths": [filePath]
            })
            .then(data => {
                const node = data.Nodes.find(node => node.Path === filePath);
                if (node) {
                    console.log('Fetched node data:', node);
                    validateChecksum(node, expectedChecksum, filePath, retryCount);
                } else {
                    console.error('Node not found in response:', filePath);
                }
            })
            .catch(error => {
                console.error('Error fetching node stats:', error);
            });
        }

        // Function to validate the checksum
        function validateChecksum(node, expectedChecksum, filePath, retryCount) {
            const maxRetries = 3; // Set maximum retries to 3
            if (node.Etag === "temporary" && retryCount < maxRetries) {
                console.log('Checksum temporary. Retrying...');
                setTimeout(() => {
                    fetchCurateStats(filePath, expectedChecksum, retryCount + 1);
                }, 2000); // Retry after 2 seconds
            } else if (node.Etag === expectedChecksum) {
                console.log('Checksum validation passed.');
                updateMetaField(node.Uuid, "usermeta-file-integrity", "✓ Integrity verified");
            } else {
                console.error('Checksum validation failed.', 'Expected:', expectedChecksum, 'Received:', node.Etag);
                updateMetaField(node.Uuid, "usermeta-file-integrity", "X Integrity compromised");
            }
        }

        function updateMetaField(uuid, namespace, value) {
            const url = "/a/user-meta/update";
            const metadatas = {
                MetaDatas: [{
                    NodeUuid: uuid,
                    Namespace: namespace,
                    JsonValue: JSON.stringify(value),
                    Policies: [{
                        Action: "READ",
                        Effect: "allow",
                        Subject: "*",
                    }, {
                        Action: "WRITE",
                        Effect: "allow",
                        Subject: "*",
                    }],
                }],
                Operation: "PUT",
            };
            Curate.api.fetchCurate(url, "PUT", metadatas)
        }
    })();
});
