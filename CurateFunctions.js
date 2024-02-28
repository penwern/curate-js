const Curate = {}; // Declare Curate
Curate.aws = {
    createPresignedDownloadUrl: function(path) {
      return new Promise((resolve, reject) => {
        PydioApi.getRestClient().getOrUpdateJwt().then(jwt => {
            let params = {
                Bucket: 'io',
                Key: path,
                Expires: 6000
            };
            const frontU = pydio.getFrontendUrl();
            const url = `${frontU.protocol}//${frontU.host}`;
            const s3 = new AWS.S3({ endpoint: url });
            const signed = s3.getSignedUrl('getObject', params);
            const output = signed + '&pydio_jwt=' + jwt;
            console.log("Generated URL:", output); // Log the generated URL
            resolve(output); // Resolve the Promise with the generated URL
        }).catch(error => {
            reject(error); // Reject the Promise if there's an error
        });
    });
    },
    // Add more aws-related functions here
};
