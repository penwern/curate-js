import SparkMD5 from 'spark-md5';

class CurateWorkerManager {
    constructor() {
        this.taskQueue = [];
        this.isProcessing = false;
        this.SparkMD5 = null;
        console.log('CurateManager constructed');
    }

    async init() {
        if (!this.SparkMD5) {
            try {
                const SparkMD5Module = await import(/* webpackChunkName: "spark-md5" */ 'spark-md5');
                this.SparkMD5 = SparkMD5Module.default || SparkMD5Module;
                console.log('SparkMD5 loaded successfully');
            } catch (error) {
                console.error('Failed to load SparkMD5:', error);
                throw error;
            }
        }
    }

    async generateChecksum(file) {
        console.log('generateChecksum called with file:', file.name);
        await this.init();
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
            this.isProcessing = true;
            this.processFile(task.file)
                .then(hash => {
                    task.resolve({
                        file: task.file,
                        hash: hash,
                        name: task.file.name
                    });
                    this.processNextTask();
                })
                .catch(error => {
                    task.reject('Checksum error: ' + error.message);
                    this.processNextTask();
                });
        } else {
            this.isProcessing = false;
        }
    }

    processFile(file) {
        return new Promise((resolve, reject) => {
            const chunkSize = 2097152; // Read in chunks of 2MB
            const spark = new SparkMD5.ArrayBuffer();
            const fileReader = new FileReader();

            let currentChunk = 0;
            const loadNext = () => {
                const start = currentChunk * chunkSize;
                const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

                fileReader.onload = (e) => {
                    spark.append(e.target.result); // Append array buffer
                    currentChunk++;

                    if (currentChunk * chunkSize < file.size) {
                        loadNext();
                    } else {
                        const hash = spark.end();
                        resolve(hash);
                    }
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };

                const slice = file.slice(start, end);
                fileReader.readAsArrayBuffer(slice);
            };

            loadNext();
        });
    }
}

export default CurateWorkerManager;