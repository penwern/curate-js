class CurateWorkerManager {
    constructor() {
        this.workerScriptUrl = new URL('../workers/hashWorker.js', import.meta.url);
        this.taskQueue = [];
        this.isProcessing = false;
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
            }
            this.processNextTask();
        };

        this.worker.onerror = event => {
            if (this.currentReject) {
                this.currentReject('Worker error: ' + event.message);
            }
            this.processNextTask();
        };
    }

    generateChecksum(file) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({ file, resolve, reject });
            if (!this.isProcessing) {
                this.processNextTask();
            }
        });
    }

    processNextTask() {
        if (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            this.currentResolve = task.resolve;
            this.currentReject = task.reject;
            this.currentFile = task.file;
            this.isProcessing = true;
            this.worker.postMessage({ file: task.file, msg: "begin hash" });
        } else {
            this.isProcessing = false;
        }
    }
}
export default CurateWorkerManager;