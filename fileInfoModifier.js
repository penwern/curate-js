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
	return(document.querySelector(".workspace-current").textContent.toLowerCase().replace(" ","-"))
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
        if(scanArr[0]==undefined){
        	scanArr[0] = 'File has not been scanned'
        }
        if(scanArr[1]==undefined){
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

function addInfo(){
  var pid = getMetaPid()
  var scanarr = getMetaScan()
  var scan = scanarr[0]
  var scan2 = scanarr[1]
  var tag = getMetaTag()
  var mime = getMetaMime()
  var status
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
  if(status==undefined){status= 'Risk'}
  addFileInfo(pid, scan,scan2, tag, mime, status)
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
const memer = new MutationObserver((mutations, memer) => {
	//console.log("memer: ", mutations)
})
const observer = new MutationObserver((mutations, observer) => {
//console.log(mutations)
var source
var clickList
//var result = mutations.filter(record => record.target.selected == true && record.attributeName == 'class');
var result = mutations;
if (result.length !== 0){
	var currSelectVol = window.pydio._dataModel._selectedNodes.length
  if (currSelectVol == 1 && selC>1){
   multosingDelay()   
  }
  selC = currSelectVol
}

	for (var recordno in mutations){
  		var recordselected = mutations[recordno].target.selected
			var target = mutations[recordno].target.className
      var targetID = mutations[recordno].target.getAttribute('id');
			var searchText = mutations[recordno].target.innerHtml
      //if !window.location.includes("settings"){
        //var infoBtnState = document.querySelector("#orbit_content > div > div.desktop-container.vertical_layout.vertical_fit > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button").style.backgroundColor
      //};
      try {if (target.includes('chevron-')){
      	source = mutations[recordno].target.parentElement.parentElement.parentElement.parentElement.innerText
        }
        
        }catch(err){}
      try {if (target.includes('chevron-down') && source == 'File Info'){
        
      	removeRows()
        lastmutation = mutations[recordno].target.id
      } 
      }catch(err){}
      try {if (target.includes('chevron-up')&& source == 'File Info'){
      	//console.log(mutations[recordno])
      	var itempath = mutations[recordno].target.id 
        var parpath = mutations[recordno].target.ownerDocument.location.pathname
        parpath = parpath.replace('/ws-','')
        parpath = parpath.replace('/','')
       	nodepath = parpath + itempath
      	addInfo()
		
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
      	addInfo()

        lastmutation = mutations[recordno].target.id
        }
}
});

function addFileInfo(pronomID, scanResult, scan2Result, etag, mimetype, qstat) {
  setTimeout(function () {
    if (!document.querySelector("#info_panel > div > div > div > div:nth-child(2)").querySelector(".panelContent")) {
      panels = "null"
    } else {
    if (panels !== "null") {
        const pCards = Array.from(document.querySelectorAll(".panelCard"));
	const fileInfoPanel = pCards.find(card => card.innerText.includes("File Info"));
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
        let newRows = document.createElement("div")
        newRows.style.marginTop = "-11px"

        let newinfodivPronom = genNewRow("Pronom ID", pronomID)
        let newinfodivScan = genNewRow("First virus scan result",scanResult)
        let newinfodivScan2 = genNewRow("Second virus scan result",scan2Result)
        let newinfodivMime = genNewRow("Mimetype",mimetype)
        let newinfodivStatus = genNewRow("Status",qstat)

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
      }
    }
  }, 5);
}

observer.observe(document, {
  subtree: true,
  attributes: true
});

     
