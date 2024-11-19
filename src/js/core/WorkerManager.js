import HashWorker from "../workers/hashWorker.worker.js";

class CurateWorkerManager {
  constructor() {
    this.taskQueue = [];
    this.isProcessing = false;
    this.worker = null;
  }

  initWorker() {
    if (this.worker) {
      this.worker.terminate();
    }
    const workerUrl = `/workers/hashWorker.js?v=${Date.now()}`; // Add cache busting
    this.worker = new Worker(workerUrl);
    console.log("Worker initialized: ", this.worker);
    this.setupWorkerHandlers();
  }
  setupWorkerHandlers() {
    this.worker.onmessage = (event) => {
      console.log("goober: ", event.data);
      if (event.data.status === "complete" && this.currentResolve) {
        this.currentResolve({
          file: this.currentFile,
          hash: event.data.hash,
          name: this.currentFile.name,
        });
      }
      this.processNextTask();
    };

    this.worker.onerror = (event) => {
      if (this.currentReject) {
        this.currentReject("Worker error: " + event.message);
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
      if (!this.worker) {
        this.initWorker();
      }
      const task = this.taskQueue.shift();
      this.currentResolve = task.resolve;
      this.currentReject = task.reject;
      this.currentFile = task.file;
      this.isProcessing = true;
      this.worker.postMessage({ file: task.file, msg: "begin hash" });
    } else {
      this.isProcessing = false;
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
    }
  }
}

export default CurateWorkerManager;
