class CurateWorkerManager {
    constructor(scriptUrl) {
        this.scriptUrl = scriptUrl;
        this.initWorker();
    }

    initWorker() {
        fetch(this.scriptUrl)
            .then(response => response.ok ? response.text() : Promise.reject('Failed to load worker script.'))
            .then(scriptContent => {
                const blob = new Blob([scriptContent], { type: 'application/javascript' });
                const blobURL = URL.createObjectURL(blob);
                this.worker = new Worker(blobURL);
            })
            .catch(error => {
                console.error('Worker initialization failed:', error);
            });
    }

    generateChecksum(file) {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                return reject('Worker not initialized.');
            }

            this.worker.onmessage = event => {
                if (event.data.status === "complete") {
                    resolve({
                        file: file,
                        hash: event.data.hash,
                        name: file.name
                    });
                }
            };

            this.worker.onerror = event => {
                reject('Worker error: ' + event.message);
            };

            this.worker.postMessage({ file: file, msg: "begin hash" });
        });
    }
}

export default CurateWorkerManager