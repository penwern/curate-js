
function getMeta() {
	try{
		return Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).files[0].matches[0].id
    } catch(err){
    console.log("no pronom id")
    return "File has not been characterised"
    }
}



var lastmutation = {}
var attempts = 0
const observer = new MutationObserver((mutations, observer) => {

	for (var recordno in mutations){
  		var recordselected = mutations[recordno].target.selected

      //console.log("curr: ", mutations[recordno].target.id)
  		if (recordselected === true && lastmutation !== mutations[recordno].target.id){
      	var itempath = mutations[recordno].target.id 
        var parpath = mutations[recordno].target.ownerDocument.location.pathname
        parpath = parpath.replace('/ws-','')
        parpath = parpath.replace('/','')
       	nodepath = parpath + itempath
      	
        addFileInfo(getMeta())

        lastmutation = mutations[recordno].target.id
        }
      }
});

observer.observe(document, {
  subtree: true,
  attributes: true
});





function addFileInfo(pronomID) {
  let panels = document.querySelector("#info_panel > div > div > div").childElementCount;
  try{
  	//let panels = document.querySelector("#info_panel > div > div.scrollarea-content > div").childElementCount;
    let panels = document.querySelector("#info_panel > div > div > div").childElementCount;
  } catch(err){
  	panels = null
  }
  var xpanel = 1
  if (panels !== null){
    while (xpanel < panels){

  
    const container = document.querySelector("#info_panel > div > div.scrollarea-content > div > div:nth-child("+xpanel+")");
    
    if (container.textContent.includes('File Info')){

			
      let newinfodiv = document.createElement("div");
      newinfodiv.class = "infoPanelRow"
      newinfodiv.style.padding = "0px 16px 6px"

      let newinfolabel = document.createElement("div");
      newinfolabel.class = "infoPanelLabel"
      newinfolabel.textContent = "Pronom ID"

      let newinfovalue = document.createElement("div");
      newinfovalue.class = "infoPanelValue"
      newinfovalue.textContent = pronomID

      newinfodiv.appendChild(newinfolabel)
      newinfodiv.appendChild(newinfovalue)
			if (!(container.textContent.includes('Pronom'))){
      	
      	container.appendChild(newinfodiv)
      	
			}else{
      	container.removeChild(container.lastChild);
        
      	container.appendChild(newinfodiv)
      }

    }else{
    }
   xpanel++
  }
 }
}


