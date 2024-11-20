class CurateWorkerManager {
  constructor(poolSize = 5) {
    this.poolSize = poolSize;
    this.workers = new Map(); // Map of active workers
    this.taskQueue = [];
    this.currentTasks = new Map(); // Track current task for each worker
  }

  initWorker() {
    const worker = new Worker("/workers/hashWorker.js");
    const workerId = crypto.randomUUID();

    worker.onmessage = (event) => {
      if (event.data.status === "complete") {
        const currentTask = this.currentTasks.get(workerId);
        if (currentTask) {
          currentTask.resolve({
            file: currentTask.file,
            hash: event.data.hash,
            name: currentTask.file.name,
          });
          this.currentTasks.delete(workerId);
        }
        this.processNextTask(workerId, worker);
      }
    };

    worker.onerror = (event) => {
      const currentTask = this.currentTasks.get(workerId);
      if (currentTask) {
        currentTask.reject("Worker error: " + event.message);
        this.currentTasks.delete(workerId);
      }
      this.processNextTask(workerId, worker);
    };

    this.workers.set(workerId, worker);
    return workerId;
  }

  generateChecksum(file) {
    return new Promise((resolve, reject) => {
      const task = { file, resolve, reject };
      this.taskQueue.push(task);
      this.ensureWorkers();
    });
  }

  ensureWorkers() {
    // Create workers up to pool size if there are pending tasks
    if (this.taskQueue.length > 0) {
      while (this.workers.size < this.poolSize) {
        const workerId = this.initWorker();
        this.processNextTask(workerId, this.workers.get(workerId));
      }
    }
  }

  processNextTask(workerId, worker) {
    if (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      this.currentTasks.set(workerId, task);
      worker.postMessage({ file: task.file, msg: "begin hash" });
    } else if (this.currentTasks.size === 0) {
      // No more tasks in queue and no running tasks - cleanup workers
      this.cleanupWorkers();
    }
  }

  cleanupWorkers() {
    for (const [workerId, worker] of this.workers) {
      worker.terminate();
    }
    this.workers.clear();
  }

  // Optional: Method to manually cleanup if needed
  terminate() {
    this.cleanupWorkers();
    this.taskQueue = [];
    this.currentTasks.clear();
  }
}

export default CurateWorkerManager;
