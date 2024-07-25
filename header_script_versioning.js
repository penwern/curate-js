const mode = "dev";
const versionOverride = null

document.addEventListener('DOMContentLoaded', function() {
    waitForPydio().then(() => {
        getScriptVersion()
    }).catch(() => {
        console.error("pydio is not available");
    });
})

const waitForPydio = () => {
    return new Promise((resolve, reject) => {
        (function checkPydio() {
            if (typeof pydio !== 'undefined') {
                resolve();
            } else {
                setTimeout(checkPydio, 100);
            }
        })();
    });
}

const getScriptVersion = () => {
    PydioApi._PydioRestClient.getOrUpdateJwt().then(t => {
        getVersion(t)
            .then(r => {
                if (r.status !== 200) throw new Error("HTTP Error");
                return r.json();
            })
            .then(r => {
                const version = versionOverride || r.ajxpVersion;
                const script = document.createElement("script");
                const baseUrl = `https://penwern.github.io/${mode === "dev" ? "curate-dev-js" : "curate-js"}/dist/${version}/main_${version}.js` 
                script.src = baseUrl;
                console.log(baseUrl)
                document.body.appendChild(script);
            })
            .catch(error => {
                console.error("Error fetching version:", error);
            });
    }); 
}
const getVersion = (token) => fetch(window.location.origin+"/a/frontend/bootconf", {
    headers: {
        accept: "*/*",
        authorization: "Bearer " + token,
        priority: "u=1, i",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include"
});