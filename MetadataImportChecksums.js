async function getAvailableFilename(token, pathname, headers) {
  return await checkAndIncrementPathname(token, pathname,headers);
}

async function checkAndIncrementPathname(token, pathname, commonHeaders, increment = 0) {
  const extIndex = pathname.lastIndexOf('.');
  const baseName = extIndex !== -1 ? pathname.slice(0, extIndex) : pathname;
  const extension = extIndex !== -1 ? pathname.slice(extIndex) : '';
  const incrementedPathname = increment === 0 ? pathname : `${baseName}-${increment}${extension}`;
  const request = await fetch("https://www.curate.penwern.co.uk/a/tree/stats", {
    method: "POST",
    headers: {
      ...commonHeaders,
      "authorization": "Bearer " + token
    },
    body: JSON.stringify({ "NodePaths": [incrementedPathname] })
  });
  if (request.ok) {
    const response = await request.json();
    const isPathnameTaken = response.Nodes;
    if (isPathnameTaken && isPathnameTaken.length > 0) {
      return checkAndIncrementPathname(token, pathname, commonHeaders, increment + 1);
    } else {
      return incrementedPathname;
    }
  } else {
    console.error("Error checking pathname");
    return null;
  }
}
function curateNotification(input, token){ //send a notification to a Curate user
    let url
    if (input.NodeId){
        url = "https://"+window.location.hostname+"/a/scheduler/hooks/notifynode"
    }else{
        url = "https://"+window.location.hostname+"/a/scheduler/hooks/notify"
    }
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"JobParameters":input})
    };
    fetch(url, fetchOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(err => console.error('error', err));
}
function searchNodesWithTokens(bearerToken, body) { //get tree 
    let url = "https://"+window.location.hostname+"/a/tree/stats";
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      body: body
    };
    return fetch(url, fetchOptions);
}
function generateJson(files) {  //convert upload input to nodepaths
    const ps = Object.values(files).map(obj => `${getOpenWS()}/${obj.webkitRelativePath}`);
    const result = {
        "NodePaths": ps
    }
    return JSON.stringify(result);
}
function associateNodes(inputA, inputB, folderMode) { //associate pre-upload files with Curate nodes
  const result = []; // initialize an empty result array
  for (const nodeA of inputA) {
    const filename = nodeA.filename.replace(/^objects\//, ''); // remove "objects/" prefix
    for (const nodeB of inputB) {
      if (nodeB.Path === filename) {
        nodeA.filename = nodeB.Uuid;
        result.push(nodeA); // add the matched nodeA to the result array
        break; // stop looking for matches for this nodeA
      }
    }
  }
  return result;
}
function convertMetadataArrayToObject(metadataArray) { //convert import metadata to Curate meta update body
  const metaDatas = [];
  metadataArray.forEach(metadata => {
    const nodeId = metadata.filename;
    delete metadata.filename;
    Object.entries(metadata).forEach(([namespace, jsonValue]) => {
      metaDatas.push({
        NodeUuid: nodeId,
        Namespace: `usermeta-${namespace.replace(".","-")}`,
        JsonValue: JSON.stringify(jsonValue),
      });
    });
  });
  return { MetaDatas: metaDatas, Operation: "PUT" };
}
function metadataReaderHandler(e, userId, parentId, token,cNodes, metaOnly){ //handle contents of metadata import document.
    var parsedMeta
    try{
       parsedMeta = JSON.parse(e.target.result) 
    }catch(err){
        console.error("Parsing Error: ",err)
        curateNotification({
            "Title": "Metadata Parsing Error",
            "Text": "Metadata import failed because your import JSON failed to parse correctly.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+err,
            "UserId": userId
        }, token)
        return
    }
    if (metaOnly){
        const searchImportNodes = searchNodesWithTokens(token, JSON.stringify(
            {  //search Curate for uploaded nodes
                "NodePaths": parsedMeta.map(obj => (
                   obj.filename.replace("objects/", "")
                ))
            }
        ))
        searchImportNodes
            .then(response => {
                if (response.status !== 200){
                    console.log("Metadata Update Error")
                    curateNotification({
                        "Title": "Metadata Update Error",
                        "Text": "Metadata import failed because there was an error finding your import objects.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+response,
                        "UserId": userId
                    }, token)    
                }else{
                    response.json()
                        .then(rjs => {
                            if (Object.keys(rjs).length == 0){
                                console.log("No Associations Found")
                                curateNotification({
                                    "Title": "No Associations Found",
                                    "Text": "No associations were found in your import document.",
                                    "UserId": userId
                                }, token)
                            }else{
                                var asc
                                try{
                                    console.log("assssss: ", rjs)
                                    asc = associateNodes(parsedMeta,rjs.Nodes)
                                }catch(err){
                                    console.error("Association Error: ",err)
                                    curateNotification({
                                        "Title": "Metadata Association Error",
                                        "Text": "Metadata import failed because there was an eror associating your metadata to its objects.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+err,
                                        "UserId": userId
                                    }, token)
                                    return
                                }
                                if (asc.length == 0){
                                    console.log("No Associations Found")
                                    curateNotification({
                                        "Title": "No Associations Found",
                                        "Text": "No associations were found in your import document.",
                                        "UserId": userId
                                    }, token)
                                    return
                                }
                                const metadatas = convertMetadataArrayToObject(asc)   
                                const url = "https://demo.curate.penwern.co.uk/a/user-meta/update";
                                const authorizationHeader = `Bearer ${token}`;
                                fetch(url, {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": authorizationHeader
                                  },
                                  body: JSON.stringify(metadatas)
                                })
                                .then(response => {
                                    if (response.status !== 200){
                                        console.error("Metadata Update Error")
                                        curateNotification({
                                            "Title": "Metadata Update Error",
                                            "Text": "Metadata import failed because there was an error updating your metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+response,
                                            "UserId": userId
                                        }, token)
                                        return
                                    }else{
                                        response.json()
                                        .then(rjs =>{ 
                                            console.log("Metadata import detail: ", rjs)
                                            curateNotification({
                                                "Title": "Metadata Import Successful",
                                                "Text": "Metadata import was successful.</br></br>**Update Detail**</br>Updated "+rjs.MetaDatas.length+" metadata fields",
                                                "UserId": userId
                                        }, token) 
                                        }
                                    )
                                    }  
                                })
                                .catch(err => {
                                    console.error("Metadata Update Error: ",err)
                                    curateNotification({
                                        "Title": "Metadata Update Error",
                                        "Text": "Metadata import failed because there was an eror updating your objects metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+err,
                                        "UserId": userId
                                    }, token)
                                });    
                            }
                            
                        })
                }
            })
    }else{
        var asc
        try{
            asc = associateNodes(parsedMeta,cNodes.Nodes,true)
        }catch(err){
            console.log("Association Error: ",err)
            curateNotification({
                "Title": "Metadata Association Error",
                "Text": "Metadata import for [Object] failed because there was an eror associating your metadata to its objects.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+err,
                "UserId": userId,
                "NodeId": parentId
            }, token)
            return
        }
        if (asc.length == 0){
            console.log("No Associations Found")
            curateNotification({
                "Title": "No Associations Found",
                "Text": "Metadata import for [Object] was successful, but no associations were found in your import document.",
                "UserId": userId,
                "NodeId": parentId
            }, token)
            return
        }
        const metadatas = convertMetadataArrayToObject(asc)   
        const url = "https://"+window.location.hostname+"/a/user-meta/update";
        const authorizationHeader = `Bearer ${token}`;
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authorizationHeader
          },
          body: JSON.stringify(metadatas)
        })
        .then(response => {
            if (response.status !== 200){
                console.log("Metadata Update Error")
                curateNotification({
                    "Title": "Metadata Update Error",
                    "Text": "Metadata import for [Object] failed because there was an error updating your uploaded objects metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+response,
                    "UserId": userId,
                    "NodeId": parentId
                }, token)
                return
            }else{
                response.json()
                .then(rjs =>{ 
                    console.log("Metadata import detail: ", rjs)
                    curateNotification({
                        "Title": "Metadata Import Successful",
                        "Text": "Metadata import for [Object] was successful.</br></br>**Update Detail**</br>Updated "+rjs.MetaDatas.length+" metadata fields",
                        "UserId": userId,
                        "NodeId": parentId
                }, token) 
                }
            )
            }  
        })
        .catch(error => {
          console.error(error);
            console.log("Metadata Update Error: ",err)
            curateNotification({
                "Title": "Metadata Update Error",
                "Text": "Metadata import for [Object] failed because there was an eror updating your uploaded objects metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+err,
                "UserId": userId,
                "NodeId": parentId
            }, token)
        });        
    }    
}
function importMetadata(cF,l,f,type){
    pydio.user.getIdmUser().then(pydUser => pydUser.Uuid) //make sure auth token is fresh
      .then(userId => {
        const token = PydioApi._PydioRestClient.authentications.oauth2.accessToken
        if (type == "userfile"){
          for (const index in f){ //look for a metadata file in the upload
            if (f[index].name == "metadata.json"){
              let reader = new FileReader();
              reader.addEventListener("load", e=> metadataReaderHandler(e,userId,null,token,null,true)) //attach the metadata importer
              reader.readAsText(f[index]) //read the metadata import file
              return
            }
          }
        }
        else if (type =="userfolder"){
          const searchParent = searchNodesWithTokens(token, JSON.stringify({  //search Curate for uploaded nodes
            "NodePaths":[`${getOpenWS()}/${f[0].webkitRelativePath.split("/")[0]}`]
          })) 
          searchParent
            .then(r => r.json())
            .then(rjs => rjs.Nodes[0].Uuid)
            .then(parentId => {
              const jsonBody = generateJson(f)
              const res = searchNodesWithTokens(token, jsonBody)
              res.then(r => r.json())
                .then(rjs => {
                for (const index in f){ //look for a metadata file in the upload
                  if (f[index].name == "metadata.json"){
                    let reader = new FileReader();
                    reader.addEventListener("load", e=> metadataReaderHandler(e,userId,parentId,token,rjs)) //attach the metadata importer
                    reader.readAsText(f[index]) //read the metadata import file
                  }
                }
              })     
            })
        }
    })
}
function longtaskCounter(cF,l,f,type,checksums, uploadTime){
    cF += 1
    if (cF !== l*2){
        pydio.observeOnce("longtask_finished",()=>{longtaskCounter(cF,l,f,type,checksums)}) //if uploads are still in progress watch the next longtask
    }else{
      setTimeout(()=>{ //wait a moment to ensure uploads are finished
          verifyChecksums(checksums)
          if (f.length==1 && f[0].name !== "metadata.json"){
            return
        }
        if (type){
          importMetadata(cF,l,f,type) 
        }
      },(l*10)) 
    }
}
function uploadChecksumHandler(files){
  if(typeof(Worker) != 'undefined') {
    const fileHashes = []
    Array.from(files).forEach(function(file){
      var blob = new Blob([document.querySelector('#hashWorker').textContent]);
      var blobURL = window.URL.createObjectURL(blob);
      var myWorker = new Worker(blobURL);
      const authSession = PydioApi._PydioRestClient.getAuthToken();
      authSession.then(token => {
        //const pathname = (pydio._dataModel._currentRep === "/") ? (getOpenWS() + "/" + file.name) : (getOpenWS() + pydio._dataModel._currentRep + "/" + file.name);
        const basePath = getOpenWS() + (pydio._dataModel._currentRep !== "/" ? pydio._dataModel._currentRep + "/" : "");
        const relativePath = (file.webkitRelativePath ? "/" + file.webkitRelativePath : "");
        const pathname = basePath + relativePath + (relativePath ? "" : "/"+file.name);
        const headers = {
          "content-type": "application/json",
          "accept-encoding": "gzip" 
        };
        getAvailableFilename(token, pathname, headers)
          .then(availableFilename => {
            //const relpath = (pydio._dataModel._currentRep === "/") ? (availableFilename) : (getOpenWS() + pydio._dataModel._currentRep + availableFilename.replace(getOpenWS(),""));
            console.log('[Main]', 'Init Web Worker');
            myWorker.onmessage = function(event) {
              if (event.data.status == "complete"){
                const aF = availableFilename.substring(availableFilename.lastIndexOf('/') + 1);
                console.log("hash is: ",event.data.hash)
                fileHashes.push({"file":file,"hash":event.data.hash, "name":aF, "relativePath":availableFilename})
              }
            }
            myWorker.postMessage({file:file, msg:"begin hash"}) 
          })
          .catch(error => {
            console.error("Error:", error);
          });
      });
    })
    return fileHashes
  }else{
    console.log("Browser does not support web-workers. Please update.")
  }   
}
function updateMetaField(uuid,namespace,value){
  pydio.user.getIdmUser().then(pydUser => pydUser.Uuid) //make sure auth token is fresh
    .then(userId => {
       return PydioApi._PydioRestClient.authentications.oauth2.accessToken
    })
    .then(token => {
      const url = "https://"+window.location.hostname+"/a/user-meta/update";
      const authorizationHeader = `Bearer ${token}`;
      const metadatas = {
        MetaDatas: [
          {
            NodeUuid: uuid,
            Namespace: namespace,
            JsonValue: JSON.stringify(value),
            Policies: [
              {
                Action: "READ",
                Effect: "allow",
                Subject: "*",
              },
              {
                Action: "WRITE",
                Effect: "allow",
                Subject: "*",
              },
            ],
          },
        ],
        Operation: "PUT",
      };
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationHeader
        },
        body: JSON.stringify(metadatas)
      })
      .then(response => {
          if (response.status !== 200){
              console.error("Update Error")
              return
          }
      })
      .catch(err => {
          console.error("Update Error: ",err)
      });   
    })
}
function compareChecksums(objectA, objectB){
    const matches = [];
    const fails = []
  objectA.Nodes.forEach((nodeA) => {
    const matchingFile = objectB.find(
      (item) =>
        item.name.toLowerCase() === JSON.parse(nodeA.MetaStore.name.toLowerCase())
    );

  if (matchingFile && matchingFile.hash === nodeA.Etag) {
    matches.push({
      Uuid: nodeA.Uuid,
      Name: JSON.parse(nodeA.MetaStore.name),
      Path: nodeA.Path,
      Etag: nodeA.Etag,
      Hash: matchingFile.hash,
    });
    updateMetaField(nodeA.Uuid, "usermeta-file-integrity", "✓ Integrity verified")
  }else if(matchingFile){
      fails.push({
          Uuid: nodeA.Uuid,
          Name: JSON.parse(nodeA.MetaStore.name),
          Path: nodeA.Path,
          Etag: nodeA.Etag,
          Hash: matchingFile.hash,
      });
      updateMetaField(nodeA.Uuid, "usermeta-file-integrity", "X Integrity compromised")
  }
});
return {"matches":matches, "fails":fails};
}

function verifyChecksums(checksums){
  pydio.user.getIdmUser().then(pydUser => pydUser.Uuid) //make sure auth token is fresh
    .then(userId => {
       return PydioApi._PydioRestClient.authentications.oauth2.accessToken
    })
    .then(token => {
        var userId = pydio.user.idmUser.Uuid
        const transformedObject = {
          NodePaths: checksums.map((item) => 
            item.relativePath
          ),
        };
        const searchNodes = searchNodesWithTokens(token, JSON.stringify(transformedObject)) 
        searchNodes
          .then(r => r.json())
          .then(rjs => {
            const comparison = compareChecksums(rjs, checksums)
            const unloadedMatch = []
            const unloadedFail = []
            if (document.querySelector(".transparent-dropzone")){
              tagUploads(comparison, unloadedMatch, unloadedFail)
            }
            const uploadLoadObs = new MutationObserver((mutationsList) => {
              for (const mutation of mutationsList) {
                if(mutation.addedNodes){
                    mutation.addedNodes.forEach(node=>{
                        if (!node.children){
                            return
                        }
                        let cs = Array.from(node.children)
                        cs.forEach(c=>{
                          if (!c.classList.contains("transparent-dropzone")){
                              return
                          }else{
                              tagUploads(comparison, [], [])
                          }
                      })
                    })
                  }
                }
            });
            uploadLoadObs.observe(document.body, { childList: true, subtree: true });
            console.log("Checksums: ", checksums)
            if (comparison.fails.length == 0 && comparison.matches.length == checksums.length){
                console.log("Checksum report, no errors: ",comparison.matches.length, " files were successfully verified, no issues were found. Please review the output object for more detail: ", comparison)
                curateNotification({
                    "Title": "Checksum Report",
                    "Text": comparison.matches.length + " Files were successfully verified. No issues were found.",
                    "UserId": userId
                }, token)
            }else if(comparison.fails.length == 0 && comparison.matches.length !== checksums.length){
                console.log("Checksumming error, could not generate checksums for all files")
                curateNotification({
                    "Title": "Checksum Report",
                    "Text": "Checksumming error, could not generate checksums for all files.</br>Please review the developer console for further details.",
                    "UserId": userId
                }, token)
            }else if(comparison.fails.length !== 0){
                console.log("Checksum report, issues found: ", comparison.fails.length, " files had inconsistent checksums. Check the output object for more detail: ", comparison.fails)
                curateNotification({
                    "Title": "Checksum Report",
                    "Text": comparison.fails.length + " files had inconsistent checksums. Please review the developer console for further details.",
                    "UserId": userId
                }, token)
            }
        })   
    })         
}
function hasEventListener(element, event, handler) {
  const eventListeners = element[event];
  return eventListeners && eventListeners.some(listener => listener === handler);
}
const folderHandler=(e)=>{
  if(e.target.closest(".upload-loaded") && e.target.closest(".upload-loaded").querySelector(".mdi-folder")){
    if (e.target.closest(".upload-loaded").querySelector(".mdi-chevron-down")){
      return
    }
    setTimeout(function(){
      tagUploads(comparison, [], [])  
    },150)
  }
}
const removeHandler=(e)=>{
    console.log("remove handling: ", e)
   if (e.target.classList.contains("mdi-close-circle-outline")){
    tagUploads(comparison, unloadedMatch, unloadedFail)
  }
}
function tagUploads(comparison, unloadedMatch, unloadedFail){
  var uploadedElements = Array.from(document.querySelectorAll(".upload-loaded"))
  comparison.matches.forEach(match => {
    let pathLevels = match.Path.split("/").slice(1);
    pathLevels.forEach(level=>{
      const matchingDiv = uploadedElements.find((element) =>
        element.textContent.includes(level)
      )
      if (!matchingDiv){
        return
      }
      const matchDivs = Array.from(matchingDiv.querySelectorAll("div"))
      const matchPar = matchDivs.find((element) =>
        element.textContent.includes(level)
      )
      if (matchPar.querySelector(".mdi-folder") && !matchPar.hasAttribute("listening")){
        matchPar.setAttribute("listening", true)
        matchPar.addEventListener("click", folderHandler)
        return
      }else if(matchPar.querySelector(".mdi-folder")){
        return
      }else if(!matchPar.textContent.includes("File verified")){
          const posTag = generateVerificationMessage(true)
          Array.from(matchPar.querySelectorAll("div")).find((el) => el.textContent.trim() == (level)).after(posTag)
      }          
      })  
  });
  comparison.fails.forEach(match => {
    setTimeout(e=>{
      let pathLevels = match.Path.split("/").slice(1);
      pathLevels.forEach(level=>{
        const matchingDiv = uploadedElements.find((element) =>
          element.textContent.includes(level)
        )
        if (!matchingDiv){
          return
        }
        const matchDivs = Array.from(matchingDiv.querySelectorAll("div"))
        const matchPar = matchDivs.find((element) =>
          element.textContent.includes(level)
        )
        if (matchPar.querySelector(".mdi-folder") && !matchPar.hasAttribute("listening")){
          matchPar.setAttribute("listening", true)
          matchPar.addEventListener("click", folderHandler)
          return
        }else if(matchPar.querySelector(".mdi-folder")){
          return
        }else if(!matchPar.textContent.includes("File compromised")){
            const posTag = generateVerificationMessage(false)
            Array.from(matchPar.querySelectorAll("div")).find((el) => el.textContent.trim() == (level)).after(posTag)
        }          
        })
    }, 200)
  });
  if (document.querySelector(".mdi-plus-box-outline")){
    document.querySelector(".mdi-plus-box-outline").parentElement.addEventListener("click", ()=>{
      setTimeout(function(){
        tagUploads(comparison,[],[])
      },200)
    })
  }
  let dz = document.querySelector(".transparent-dropzone");
  if (!dzEAdded) {
    dz.addEventListener("click", removeHandler);
    
    dzEAdded = true
  }
  
}
function loadMoreHandler(unloadedMatch, unloadedFail){
  const unloadedMatchRep = []
  const unloadedFailRep = []
  setTimeout(()=>{
    let uploadedElements = Array.from(document.querySelectorAll(".upload-loaded"))
    unloadedMatch.forEach(match => {
      const matchingDiv = uploadedElements.find((element) =>
        element.textContent.includes(match.Name)
      )?.querySelectorAll("div");
      const foundElement = Array.from(matchingDiv || []).find(
        (div) => div.textContent.trim() === match.Name
      );
      
      if (!foundElement){
        unloadedMatchRep.push(match)
      }else{
        const posTag = generateVerificationMessage(true)
        foundElement.after(posTag)
      }
    });
    unloadedFail.forEach(match => {
      const matchingDiv = uploadedElements.find((element) =>
        element.textContent.includes(match.Name)
      )?.querySelectorAll("div");
      const foundElement = Array.from(matchingDiv || []).find(
        (div) => div.textContent.trim() === match.Name
      );
      
      if (!foundElement){
        unloadedFailRep.push(match)
      }else{
        const posTag = generateVerificationMessage(false)
        foundElement.after(posTag)
      }
    });
    unloadedMatch.splice(0, unloadedMatch.length, ...unloadedMatchRep);
    unloadedFail.splice(0, unloadedFail.length, ...unloadedFailRep);
  },100)
  if (document.querySelector(".mdi-plus-box-outline")){
    document.querySelector(".mdi-plus-box-outline").parentElement.addEventListener("click",()=>{loadMoreHandler(unloadedMatch,unloadedFail)})
  }
}
function generateVerificationMessage(status){
    const verEl = document.createElement("div")
    verEl.style = "padding-left:0.3em;padding-right:0.4em;max-width:1.5em;max-height:1.7em;border:gray solid 1px;border-radius:5em;display:inline-flex;font-size:9pt;transition: ease all 0.3s;overflow:hidden;"
    if (status){
        verEl.style.color = "green"
        verEl.textContent = "✓ File verified"
        verEl.title = "File successfully verified."
    }else{
        verEl.style.color = "red"
        verEl.textContent = "X  File compromised"
        verEl.title = "File compromised. Please reupload."
        verEl.style.paddingLeft = "0.35em !important"
    }
    verEl.addEventListener("mouseover", e=>{
        e.target.style.backgroundColor = "#e2e2e2";
        e.target.style.maxWidth = "10.5em"
    })
    verEl.addEventListener("mouseleave", e=>{
        e.target.style.backgroundColor = "white";
        e.target.style.maxWidth = "1.5em"
    }) 
    return verEl
}
var dzEAdded = false
document.addEventListener("input",function(e){    
    let t = e.target
    if (t.name !== "userfile" && t.name !== "userfolder"){ //if the input isn't an upload do nothing
        return
    }else{
        const checksums = uploadChecksumHandler(t.files)
        const f = {...t.files}
        let l = t.files.length
        let cF = 0
        let s = 0
        pydio.observeOnce("longtask_finished",()=>{longtaskCounter(cF,l,f,t.name,checksums)}) //begin watching the upload tasks and process import when finished
    }
})
document.addEventListener("drop",function(e){
  if (e.dataTransfer && e.target.className !== "drop-zone dropzone-hover"){
    const checksums = uploadChecksumHandler(e.dataTransfer.files)
    const f = {...e.dataTransfer.files}
    let l = e.dataTransfer.files.length
    let cF = 0
    let s = 0
    pydio.observeOnce("longtask_finished",()=>{longtaskCounter(cF,l,f,null,checksums)}) //begin watching the upload tasks and process import when finished 
  }
}) 
