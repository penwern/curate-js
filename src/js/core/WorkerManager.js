class CurateWorkerManager {
    constructor() {
        this.workerScriptUrl = new URL('../workers/hashWorker.js', import.meta.url);
        this.initWorker();
    }

    initWorker() {
        fetch(this.workerScriptUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load worker script.');
                }
                return response.text();
            })
            .then(scriptContent => {
                const blob = new Blob([scriptContent], { type: 'application/javascript' });
                const blobURL = URL.createObjectURL(blob);
                this.worker = new Worker(blobURL);
                this.setupWorkerHandlers();
            })
            .catch(error => {
                console.error('Worker initialization failed:', error);
            });
    }

    setupWorkerHandlers() {
        this.worker.onmessage = event => {
            if (event.data.status === "complete" && this.currentResolve) {
                this.currentResolve({
                    file: this.currentFile,
                    hash: event.data.hash,
                    name: this.currentFile.name
                });
                this.cleanup();
            }
        };

        this.worker.onerror = event => {
            if (this.currentReject) {
                this.currentReject('Worker error: ' + event.message);
                this.cleanup();
            }
        };
    }

    cleanup() {
        this.currentResolve = null;
        this.currentReject = null;
        this.currentFile = null;
    }

    generateChecksum(file) {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                return reject('Worker not initialized.');
            }
            // Store the resolve and reject callbacks along with the file in the manager
            this.currentResolve = resolve;
            this.currentReject = reject;
            this.currentFile = file;

            this.worker.postMessage({ file: file, msg: "begin hash" });
        });
    }
}
export default CurateWorkerManager;