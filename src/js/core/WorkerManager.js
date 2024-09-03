
class CurateWorkerManager {
    constructor() {
        this.taskQueue = [];
        this.isProcessing = false;
        this.worker = null;
        this.workerScriptUrl = new URL('../workers/hashWorker.js', import.meta.url);
        this.initWorker();

    }

    initWorker() {
        const scriptContent = `
            importScripts("https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js")

            const incrementalMD5 = file => new Promise((resolve, reject) => {
            var loaded = 0;
            var startTime = performance.now();
            var tSize = file.size;
            const fileReader = new FileReader();
            const spark = new SparkMD5.ArrayBuffer();
            const chunkSize = 2097152; // Read in chunks of 2MB
            const chunks = Math.ceil(file.size / chunkSize);
            let currentChunk = 0;
            console.log("start")
            fileReader.onload = event => {
                console.log("loaded")
                spark.append(event.target.result); // Append array buffer
                ++currentChunk;
                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    resolve(spark.end()); // Compute hash
                }
            };

            fileReader.addEventListener("progress", event => {
                loaded += event.loaded;
                let pE = Math.round((loaded / tSize) * 100);
                let rS = pE + "%";
                // console.log(rS)
            });

            fileReader.addEventListener("loadend", event => {
                if (event.total > 0) {
                    var endTime = performance.now();
                }
            });

            fileReader.onerror = () => reject(fileReader.error);

            const loadNext = () => {
                const start = currentChunk * chunkSize;
                const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end));
            };

            loadNext();
            });

            self.onmessage = async function(event) {
            if (event.data.file && (event.data.msg == "begin hash")) {
                const gmd5 = await incrementalMD5(event.data.file);
                postMessage({ status: "complete", hash: gmd5 });
                // when finished, close the worker
                self.close();
            }
            };
        `;
        const workerDataUrl = `data:application/javascript;base64,${btoa(scriptContent)}`;
        this.worker = new Worker(workerDataUrl);
        this.setupWorkerHandlers();
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