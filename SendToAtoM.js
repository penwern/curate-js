
var token = PydioApi._PydioRestClient.authentications.oauth2.accessToken;
var selectedNode = pydio._dataModel._selectedNodes[0];
var path = selectedNode !== undefined && selectedNode !== null && selectedNode._path !== undefined ? "cellsdata/admin/atom" + selectedNode._path : "cellsdata/admin/atom" + pydio._dataModel._currentRep;
function createPresignedDownloadUrl(path) {
      return new Promise((resolve, reject) => {
        PydioApi.getRestClient().getOrUpdateJwt().then(jwt => {
            import(/* webpackChunkName: 'aws-sdk' */ 'aws-sdk').then(aws => {
                let params = {
                    Bucket: 'io',
                    Key: path,
                    Expires: 6000
                };
                const frontU = pydio.getFrontendUrl();
                const url = `${frontU.protocol}//${frontU.host}`;
                const s3 = new aws.S3({ endpoint: url });
                const signed = s3.getSignedUrl('getObject', params);
                const output = signed + '&pydio_jwt=' + jwt;
                console.log("Generated URL:", output); // Log the generated URL
                resolve(output); // Resolve the Promise with the generated URL
                })
            
            }).catch(error => {
                reject(error); // Reject the Promise if there's an error
            });
    });
    }
PydioApi.getRestClient().getOrUpdateJwt().then(jwt => {
    fetch("https://www.curate.penwern.co.uk/a/tree/admin/list", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "authorization": "Bearer " + jwt,
            "cache-control": "no-cache",
            "content-type": "application/json",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-pydio-language": "en-us"
        },
        "referrer": "https://www.curate.penwern.co.uk/settings/admin/audit",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({
            Node: {
                Path: path
            },
            Recursive: true
        }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // This returns a Promise
    }).then(data => {
        delete data.Parent
        Promise.all(data.Children.map(entry => {
            if (entry.Type === "LEAF") {
                return createPresignedDownloadUrl(entry.Path.replace("cellsdata/admin/", ""))
                    .then(downloadUrl => {
                        entry.DownloadUrl = downloadUrl;
                        console.log("Download URL for", entry.Path, ":", downloadUrl);
                    })
                    .catch(error => {
                        console.error('Error generating download URL:', error);
                    });
            }
        })).then(() => {
            // All promises resolved, now proceed with the final fetch call
            console.log("All download URLs generated, sending data...");
            console.log(data);
            fetch("http://127.0.0.1:5000/api/atom_connector/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                console.log(data);
            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }).catch(error => {
            // Handle errors from any of the promises
            console.error('There was a problem:', error);
        });
    }).catch(error => {
        // Handle errors here
        console.error('There was a problem with the fetch operation:', error);
    });
});
