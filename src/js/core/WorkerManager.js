import HashWorker from '../workers/hashWorker.worker.js';

class CurateWorkerManager {
    constructor() {
        this.taskQueue = [];
        this.isProcessing = false;
        this.worker = null;
        this.initWorker();
    }

    initWorker() {
        try {
            this.worker = new HashWorker();
            this.setupWorkerHandlers();
        } catch (error) {
            console.error('Failed to initialize worker:', error);
        }
    }

    setupWorkerHandlers() {
        if (!this.worker) {
            console.error('Worker not initialized');
            return;
        }

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
        if (this.taskQueue.length > 0 && this.worker) {
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