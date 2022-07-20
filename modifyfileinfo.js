function reqListener () {
  console.log(this.responseText);
}


function getMetaTag(){
	 try{
    let tag = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).etag
    return tag 
    } catch(err){
      //console.log("no etag")
    let tag = "Checksum could not be located"
    return tag 
    }
   
}

function getMetaScan(){
  try{
    let vscan = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["Virus Scan"]
    if (vscan == undefined){return 'File has not been scanned'}
    	else{return vscan}
    } catch(err){
      //console.log("no scan result")
      let vscan = "File has not been scanned"
      return vscan
    }
    
}
function getMetaPid() {
	try{
  	let pid = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).files[0].matches[0].id
     return pid
    } catch(err){
    //console.log("no pronom id")
    let pid = "File has not been characterised"
    return pid
    }
    
}
function removeRows(){
 //console.log("elo")
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
    	container.removeChild(container.lastChild)
      }
      xpanel++
  }
  }
}



var lastmutation = {}
var attempts = 0
const observer = new MutationObserver((mutations, observer) => {
//console.log(mutations)
	for (var recordno in mutations){
  		var recordselected = mutations[recordno].target.selected
			var target = mutations[recordno].target.className
      //console.log(target.class)
      //console.log("curr: ", mutations[recordno].target.id)
      try {if (target.includes('chevron-down')){
      	removeRows()
        lastmutation = mutations[recordno].target.id
      }
      }catch(err){}
      try {if (target.includes('chevron-up')){
      	var itempath = mutations[recordno].target.id 
        var parpath = mutations[recordno].target.ownerDocument.location.pathname
        parpath = parpath.replace('/ws-','')
        parpath = parpath.replace('/','')
       	nodepath = parpath + itempath
      	var pid = getMetaPid()
        var scan = getMetaScan()
        var tag = getMetaTag()
        addFileInfo(pid, scan, tag)
		
        //lastmutation = mutations[recordno].target.id
      }
      }catch(err){}
      let chevvy
      try{ chevvy = document.querySelector("#info_panel > div > div > div > div:nth-child(2) > div:nth-child(1) > div > button > div").lastChild.className
      }catch(err){ chevvy='ok'; }
      
      //if (chevvy == ''){chevvy='mdi mdi-chevron-down'}
    	//console.log(chevvy)
      //console.log("clas: ", document.querySelector("#info_panel > div > div > div > div:nth-child(2) > div:nth-child(1) > div > button > div").lastChild.className)
  		if (recordselected === true && lastmutation !== mutations[recordno].target.id && !chevvy.includes('chevron-down')
){
      	var itempath = mutations[recordno].target.id 
        var parpath = mutations[recordno].target.ownerDocument.location.pathname
        parpath = parpath.replace('/ws-','')
        parpath = parpath.replace('/','')
       	nodepath = parpath + itempath
      	var pid = getMetaPid()
        var scan = getMetaScan()
        var tag = getMetaTag()
        addFileInfo(pid, scan, tag)

        lastmutation = mutations[recordno].target.id
        }
      }
});

observer.observe(document, {
  subtree: true,
  attributes: true
});





function addFileInfo(pronomID, scanResult, etag) {
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
			let newRows = document.createElement("div")
			newRows.style.marginTop = "-11px"
      
      
      let newinfodivPronom = document.createElement("div");
      newinfodivPronom.class = "infoPanelRow"
      newinfodivPronom.style.padding = "0px 16px 6px"
      let newinfolabelPronom = document.createElement("div");
      newinfolabelPronom.class = "infoPanelLabel"
      newinfolabelPronom.style.fontWeight = '435'
      newinfolabelPronom.textContent = "Pronom ID"
      let newinfovaluePronom = document.createElement("div");
      newinfovaluePronom.class = "infoPanelValue"
      newinfovaluePronom.textContent = pronomID
      newinfodivPronom.appendChild(newinfolabelPronom)
      newinfodivPronom.appendChild(newinfovaluePronom)
      
      let newinfodivScan = document.createElement("div")
      newinfodivScan.class = "infoPanelRow"
      newinfodivScan.style.padding = "0px 16px 6px"
      let newinfolabelScan = document.createElement("div");
      newinfolabelScan.class = "infoPanelLabel"
      newinfolabelScan.style.fontWeight = '435'
      newinfolabelScan.textContent = "First virus scan result"
      let newinfovalueScan = document.createElement("div");
      newinfovalueScan.class = "infoPanelValue"
      //console.log("sresult: ", scanResult)
      newinfovalueScan.textContent = scanResult
      newinfodivScan.appendChild(newinfolabelScan)
      newinfodivScan.appendChild(newinfovalueScan)
      
      let newinfodivTag = document.createElement("div")
      newinfodivTag.class = "infoPanelRow"
      newinfodivTag.style.padding = "0px 16px 6px"
      let newinfolabelTag = document.createElement("div");
      newinfolabelTag.class = "infoPanelLabel"
      newinfolabelTag.style.fontWeight = '435'
      newinfolabelTag.textContent = "Checksum"
      let newinfovalueTag = document.createElement("div");
      newinfovalueTag.class = "infoPanelValue"
      newinfovalueTag.textContent = etag
      newinfodivTag.appendChild(newinfolabelTag)
      newinfodivTag.appendChild(newinfovalueTag)
      
      newRows.appendChild(newinfodivPronom)
      newRows.appendChild(newinfodivScan)
      newRows.appendChild(newinfodivTag)
      
			if (!(container.textContent.includes('Pronom'))){
      	
      	container.appendChild(newRows)
        
      	
			}else{
      	container.removeChild(container.lastChild);
        
      	container.appendChild(newRows)

      } 

    }else{
    }
   xpanel++
  }
 }
}


