
    // Modified initiateHarvestOAI function to dispatch events
    async function initiateHarvestOAI(repoUrl, identifier, metadataPrefix) {
        const id = `${repoUrl}-${identifier}`;
        try {
            window.dispatchEvent(new CustomEvent('oai-harvest-update', {
                detail: {
                id,
                status: 'loading',
                title: `Harvesting ${identifier}`,
                details: `Repository: ${repoUrl}`,
                progress: 0
                }
            }));

            const response = await fetch('http://127.0.0.1:5000/harvest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repo_url: repoUrl, identifier, metadata_prefix: metadataPrefix })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const data = await response.json();

            window.dispatchEvent(new CustomEvent('oai-harvest-update', {
                detail: {
                id,
                status: 'success',
                title: `Harvested ${identifier}`,
                details: `Successfully processed data from ${repoUrl}`,
                message: 'Data ready for update'
                }
            }));

            return data;
        } catch (error) {
            window.dispatchEvent(new CustomEvent('oai-harvest-update', {
                detail: {
                id,
                status: 'error',
                title: `Failed to harvest ${identifier}`,
                details: `Error occurred while processing ${repoUrl}`,
                message: error.message
                }
            }));
            throw error;
        }
    }
    const convertJson = inputJson => {
        // Extract the schema and data from the input JSON
        const schema = inputJson.schema;
        const dataFields = inputJson.data;
        
        // Array to hold the new format based on the schema
        let schemaArray = [];
    
        // Traverse each key-value pair in the `dataFields` object
        for (const key in dataFields) {
            // Check if the value is an array
            if (Array.isArray(dataFields[key])) {
                // Convert the array into a comma-separated string
                let value = dataFields[key].join(", ");
                // Append the object with field and value to the schemaArray
                schemaArray.push({ field: key, value: value });
            }
        }
    
        // Construct the new JSON structure using the dynamic schema
        let outputData = {};
        outputData[schema] = schemaArray;
    
        return outputData;
    };
    // Function to process all nodes concurrently
    async function processAllNodes() {
        const nodes = pydio._dataModel._selectedNodes;
        const promises = nodes.map(n => {
        const url = n._metadata.get("usermeta-import-oai-repo-url");
        const linkId = n._metadata.get("usermeta-import-oai-link-id");
        const prefix = n._metadata.get("usermeta-import-oai-metadata-prefix");
        return initiateHarvestOAI(url, linkId, prefix)
            .then(d => {
                const updateMeta = convertJson(d);
                return Curate.api.files.updateMetadata(n, updateMeta);
            })
            .catch(error => {
                console.error('Error processing node:', error);
                return null;
            });
        });

        try {
            const results = await Promise.all(promises);
            console.log('All nodes processed:', results);
        } catch (error) {
            console.error('Error processing nodes:', error);
        }
    }
    Curate.ui.modals.curatePopup({"title": "Harvesting OAI Repository", "content": "<oai-harvest-status></oai-harvest-status>"},{"afterLoaded":(c)=>{
        processAllNodes();
    }}).fire()