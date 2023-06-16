function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
function getOpenWS(){
	return(pydio._contextHolder._contextNode._label.toLowerCase())
}
function reqListener () {
  //console.log(this.responseText);
}
function getMetaMime(){
	try{
  	let mimestring = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).mimestring
    if (mimestring == undefined){
    	try{
      	let mimestring = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).mime
        if (mimestring == undefined){
        	let mimestring = 'Unidentified'
          return mimestring
        }
    		return mimestring
        }catch(err){
        	let mimestring = "NA"
          return mimestring
          }
    }
    return mimestring
  } catch(err){
  	let mimestring = "NA"
    return mimestring
  }
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
    let scanArr = [Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["usermeta-virus-scan-first"], Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["usermeta-virus-scan-second"]]
        if(scanArr[0]== undefined || scanArr[0]== ""){
        	scanArr[0] = 'File has not been scanned'
        }
        if(scanArr[1]==undefined || scanArr[1]== ""){
        	scanArr[1] = 'File has not been scanned'
        }
        return scanArr
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
	let infoPanelOpen = document.querySelector("#orbit_content > div > div.desktop-container.vertical_layout.vertical_fit > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button").style.backgroundColor
	if (infoPanelOpen == "initial"){
		//closed
		panels = "null"
	}else{
    		//open
    		let panels = document.querySelector("#info_panel > div > div > div").childElementCount;
		var xpanel = 1
  		if (panels !== "null"){
			while (xpanel < panels){
				const container = document.querySelector("#info_panel > div > div.scrollarea-content > div > div:nth-child("+xpanel+")");

				if (container.textContent.includes('File Info')&& !container.lastChild.textContent.includes('File Info')){
					container.removeChild(container.lastChild)
				}
				xpanel++
  			}
  		}
	}
}

function getQStatus(scan,scan2){
  var status = "Risk"
  if (scan == 'File has not been scanned'){
  	status = 'Risk'
  }
  if(scan.toLowerCase().includes('passed') && scan2 == 'File has not been scanned'){
  	status = 'Quarantined'
  	}
  if(scan.toLowerCase().includes('passed') && scan2 == 'File has not been scanned' && !getOpenWS().includes('quarantine')){
  	status = 'Risk, second scan will not be completed.'
  	}
  if(scan.toLowerCase().includes('passed') && scan2.toLowerCase().includes('passed')){
    status = 'Released'
    }
  return status
}

const multosingDelay = async () => {
  await delay(150);
  if (document.querySelector("#info_panel > div > div.scrollarea-content > div > div:nth-child(2) > div:nth-child(1) > div > button > div").children[0].className.includes('up')){
  	addInfo()
  }
};
var selC
var idr = []
var lastmutation = {}
var attempts = 0
const delay = ms => new Promise(res => setTimeout(res, ms));
function addFileInfo(fileInfoPanel) {
  var pid = getMetaPid()
  var scanarr = getMetaScan()
  var scan = scanarr[0]
  var scan2 = scanarr[1]
  var tag = getMetaTag()
  var mime = getMetaMime()
  var status = getQStatus(scan,scan2)
  setTimeout(function () {
        let newRows = document.createElement("div")
        newRows.style.marginTop = "-11px"
	newRows.id = "curateAdditionalInfo"
        let newinfodivPronom = genNewRow("Pronom ID", pid)
        let newinfodivScan = genNewRow("First virus scan result",scan)
        let newinfodivScan2 = genNewRow("Second virus scan result",scan2)
        let newinfodivMime = genNewRow("Mimetype",mime)
        let newinfodivStatus = genNewRow("Status",status)

        fileInfoPanel.querySelector(".panelContent").childNodes.forEach(row=>{
     	    if (row.innerText.includes('ETag')) {
	        row.firstChild.innerText = 'Checksum'
	    }
        })

        let sepDiv = document.createElement("HR")
        let qInfo = document.createElement("div")
        let bCap = document.createElement("div")
        bCap.style.marginBottom = '5px'
        qInfo.textContent = "Quarantine Info"
	qInfo.id = "quarantineInfoLabel"
        qInfo.style.color = 'rgb(77, 122, 143)'
        qInfo.style.fontSize = '14px'
        qInfo.style.fontWeight = '500'
        qInfo.style.marginLeft = "15px"
        qInfo.style.marginBottom = "10px"

        newRows.appendChild(newinfodivPronom)
        newRows.appendChild(sepDiv)
        newRows.appendChild(qInfo)
        newRows.appendChild(newinfodivStatus)
        newRows.appendChild(newinfodivScan)
        newRows.appendChild(newinfodivScan2)
        newRows.appendChild(bCap)

        if (!(fileInfoPanel.textContent.includes('Pronom'))) {
          fileInfoPanel.appendChild(newRows)
        } else {
          fileInfoPanel.removeChild(fileInfoPanel.lastChild);
          fileInfoPanel.appendChild(newRows)
        }
  }, 5);
  const genNewRow = (label, value) => {
    let n = document.createElement("div")
    n.class = "infoPanelRow"
    n.style.padding = "0px 16px 6px"
    let l = document.createElement("div")
    l.class = "infoPanelLabel"
    l.style.fontWeight = "415"
    l.textContent = label
    let v = document.createElement("div")
    v.class = "infoPanelValue"
    v.textContent = value
    n.appendChild(l)
    n.appendChild(v)
    return n
  }
}
const selectHandler=(e,fileInfoPanel)=>{
	console.log("select e: ",e)
	if(e.memo._selectedNodes[0] == selectedNode){
		return
	}
	if (fileInfoPanel.querySelector(".panelContent")){
		addFileInfo(fileInfoPanel) 
		selectedNode = e.memo._selectedNodes[0]
	}	  
}
var selectedNode 
const fileInfoObserver = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement && node.classList.contains("panelCard") && node.innerText.includes("File Info")) {
          //found fileInfoPanel
	  const fileInfoPanel = node
	  
	  // Check if "selectHandler" is in the observers array
	  if (!pydio._dataModel._observers.selection_changed.includes(selectHandler)) {
	    pydio._dataModel.observe("selection_changed", e=>{selectHandler(e,fileInfoPanel)})
	  }
	  fileInfoPanel.firstElementChild.addEventListener("click",e=>{
	      if (fileInfoPanel.querySelector(".mdi").classList.contains("mdi-chevron-up")){
		  fileInfoPanel.querySelector("#curateAdditionalInfo").remove()
	      }else if (fileInfoPanel.querySelector(".mdi").classList.contains("mdi-chevron-down")){
		  addFileInfo(fileInfoPanel)
	      }
	  })
	  if(node.querySelector(".panelContent")){
	      addFileInfo(node) 
	  }
          return;
        }
      }
    }
  }
});
fileInfoObserver.observe(document.documentElement, { childList: true, subtree: true });




