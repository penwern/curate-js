const Curate = {}; // Declare Curate

const Curate.api = {} //API helpers
Curate.api.fetchCurate = function(endpoint, method, body){
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
        // Here we'll do the UUID association
        return serverNodes;
    } catch (error) {
        console.error("Curate fetch error:", error);
        throw error;
    }   
}
