const Curate = {}; // Declare Curate

Curate.api = {} //API helpers

/**
 * Generic Curate fetch helper to make API interactions simple.
 *
 * @param {string} endpoint the API endpoint to make a request to, e.g: "/a/tree/stat"
 * 
 * @param {string} method HTTP method to use in the request
 * 
 * @param {string} body string body to be used in the request
 * 
 * @returns {json} JSON body of successful Curate request
 * 
 */
Curate.api.fetchCurate = async function(endpoint, method, body){
     try {
        const token = await PydioApi._PydioRestClient.getOrUpdateJwt();
        const fetchProps = {
            method: method,
            headers: {
                "accept": "application/json",
                "accept-language": navigator.language + ",en-GB,en-US;q=0.9,en;q=0.8",
                "authorization": "Bearer " + token,
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-pydio-language": pydio.user.getPreference("lang")
            },
            referrer: window.location.href,
            referrerPolicy: "strict-origin-when-cross-origin",
            mode: "cors",
            credentials: "include"
        }
        if (!["GET","HEAD"].includes(method)){
            fetchProps.body = JSON.stringify(body)
        }
        const response = await fetch(window.location.origin+endpoint, fetchProps);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const serverNodes = await response.json();
        return serverNodes;
    } catch (error) {
        console.error("Curate fetch error:", error);
        throw error;
    }   
}
Curate.workspaces = {} //Workspace helpers

/**
 * Get the slug of the currently open workspace.
 *
 * @returns {string} slug of the currently open workspace.
 */
Curate.workspaces.getOpenWorkspace =  function() {
    if (pydio._dataModel._rootNode._label.toLowerCase() == pydio.user.id.toLowerCase()) {
        return ("personal-files")
    }
    return (pydio._dataModel._rootNode._label.toLowerCase().replace(/^\d+\.\s*/, ''))
}