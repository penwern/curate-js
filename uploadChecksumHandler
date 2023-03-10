function uploadHandler(e){
    if (e.eventPhase == 2){
          var input = e.target
      if(typeof(Worker) != 'undefined') {
        Array.from(input.files).forEach(function(file){
          
          var blob = new Blob([document.querySelector('#hashWorker').textContent]);
          var blobURL = window.URL.createObjectURL(blob);
          var myWorker = new Worker(blobURL);
          console.log('[Main]', 'Init Web Worker');
          myWorker.onmessage = function(event) {
            if (event.data.status == "complete"){
              console.log("hash is: ",event.data.hash)
            }
          }
          myWorker.postMessage({file:file, msg:"begin hash"}) 
        })
      }else{
        console.log("Browser does not support web-workers. Please update.")
      }
    }

}
window.addEventListener("load", function(){
  let pydioLoad = setInterval(function(){
    if (pydio){
      console.log("did connect")
        // Select the target node
const targetNode = document.body;
// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };
// Callback function to execute when mutations are observed
const uploadCallback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName == "DIV"){
                    let fileInputs = Array.from(node.querySelectorAll("input[type='file']"))
                    let dropZones = node.querySelectorAll(".transparent-dropzone")
                    dropZones.forEach((zone) =>{
                        fileInputs.push(zone)
                    })
                    if (fileInputs.length >0){
                       fileInputs.forEach((input) =>{
                           input.addEventListener("change", function(e){uploadHandler(e)})
                       })
                    }
                }   
            });
    }
};

// Create an observer instance linked to the callback function
const UploadInputObserver = new MutationObserver(uploadCallback);

// Start observing the target node for configured mutations
UploadInputObserver.observe(targetNode, config); 
    clearInterval(pydioLoad)
    }
  }, 200)
})
