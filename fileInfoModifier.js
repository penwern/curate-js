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
function styleMeta(panelDiv){
	var panel = panelDiv.parentElement
  var metFields = panel.children[1].children[0].children
for (var x in metFields){
    try{
        if(metFields[x].innerText.includes('*dcsep*')){
            var seperator = metFields[x]
            seperator.removeChild(seperator.lastChild)
            seperator.innerText = 'Dublin Core'
            seperator.style.color = "rgb(77, 122, 143)"
            seperator.style.fontSize = "14px"
            seperator.style.fontWeight = "500"
        }
    }catch(err){
    }
}
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
      }else if(target.includes('chevron-down') && source == 'Meta Data'){
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
      }else if(target.includes('chevron-up')&& source == 'Meta Data'){
      	waitForElm('.infoPanelValue').then((elm) => {
          styleMeta(mutations[recordno].target.parentElement.parentElement.parentElement.parentElement)
				});
        
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
  setTimeout(function(){ //file info panel takes 5ms to load in subfolders for some reason
  	if (!document.querySelector("#info_panel > div > div > div > div:nth-child(2)").querySelector(".panelContent")){
    		//closed
		panels = "null"
	}else{
		
    //open
    let panels = document.querySelector("#info_panel > div > div > div").childElementCount;
  
  var xpanel = 1
  if (panels !== "null"){
    while (xpanel < panels){

    
    var container = document.querySelector("#info_panel > div > div.scrollarea-content > div > div:nth-child("+xpanel+")");
      //console.log(container)
    if (container.textContent.includes('File Info')){
			let newRows = document.createElement("div")
			newRows.style.marginTop = "-11px"
      
      
      let newinfodivPronom = document.createElement("div");
      newinfodivPronom.class = "infoPanelRow"
      newinfodivPronom.style.padding = "0px 16px 6px"
      let newinfolabelPronom = document.createElement("div");
      newinfolabelPronom.class = "infoPanelLabel"
      newinfolabelPronom.style.fontWeight = '415'
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
      newinfolabelScan.style.fontWeight = '415'
      newinfolabelScan.textContent = "First virus scan result"
      let newinfovalueScan = document.createElement("div");
      newinfovalueScan.class = "infoPanelValue"
      //console.log("sresult: ", scanResult)
      newinfovalueScan.textContent = scanResult
      newinfodivScan.appendChild(newinfolabelScan)
      newinfodivScan.appendChild(newinfovalueScan)
      
      let newinfodivScan2 = document.createElement("div")
      newinfodivScan2.class = "infoPanelRow"
      newinfodivScan2.style.padding = "0px 16px 6px"
      let newinfolabelScan2 = document.createElement("div");
      newinfolabelScan2.class = "infoPanelLabel"
      newinfolabelScan2.style.fontWeight = '415'
      newinfolabelScan2.textContent = "Second virus scan result"
      let newinfovalueScan2 = document.createElement("div");
      newinfovalueScan2.class = "infoPanelValue"
      newinfovalueScan2.textContent = scan2Result
      newinfodivScan2.appendChild(newinfolabelScan2)
      newinfodivScan2.appendChild(newinfovalueScan2)
      
      container.childNodes.forEach(function(a){
      if(a.className.includes('panelContent')){
        a.childNodes.forEach(function(b){
            if(b.innerText.includes('ETag')){
                b.firstChild.innerText = 'Checksum'
            }
          })
        }
      })
      
      let newinfodivMime = document.createElement("div")
      newinfodivMime.class = "infoPanelRow"
      newinfodivMime.style.padding = "0px 16px 6px"
      let newinfolabelMime = document.createElement("div");
      newinfolabelMime.class = "infoPanelLabel"
      newinfolabelMime.style.fontWeight = '415'
      newinfolabelMime.textContent = "Mimetype"
      let newinfovalueMime = document.createElement("div");
      newinfovalueMime.class = "infoPanelValue"
      newinfovalueMime.textContent = mimetype
      newinfodivMime.appendChild(newinfolabelMime)
      newinfodivMime.appendChild(newinfovalueMime)
      
      let newinfodivStatus = document.createElement("div")
      newinfodivStatus.class = "infoPanelRow"
      newinfodivStatus.style.padding = "0px 16px 6px"
      let newinfolabelStatus = document.createElement("div");
      newinfolabelStatus.class = "infoPanelLabel"
      newinfolabelStatus.style.fontWeight = '415'
      newinfolabelStatus.textContent = "Status"
      let newinfovalueStatus = document.createElement("div");
      newinfovalueStatus.class = "infoPanelValue"
      newinfovalueStatus.textContent = qstat
      newinfodivStatus.appendChild(newinfolabelStatus)
      newinfodivStatus.appendChild(newinfovalueStatus)
      
      let sepDiv = document.createElement("HR")
      let qInfo = document.createElement("div")
      let bCap = document.createElement("div")
      bCap.style.marginBottom = '5px'
      qInfo.textContent = "Quarantine Info"
      qInfo.style.color = 'rgb(77, 122, 143)'
      qInfo.style.fontSize = '14px'
      qInfo.style.fontWeight = '500'
      qInfo.style.marginTop = "-8px"
      qInfo.style.marginLeft = "15px"
      qInfo.style.marginBottom = "10px"
      
      //newRows.appendChild(newinfodivMime)
      newRows.appendChild(newinfodivPronom)
      //newRows.appendChild(newinfodivTag)
      newRows.appendChild(sepDiv)
      newRows.appendChild(qInfo)
      newRows.appendChild(newinfodivStatus)
      newRows.appendChild(newinfodivScan)
      newRows.appendChild(newinfodivScan2)
      newRows.appendChild(bCap)
      
      
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
  //let panels = document.querySelector("#info_panel > div > div > div").childElementCount;
  
  	//let panels = document.querySelector("#info_panel > div > div.scrollarea-content > div").childElementCount;
    
    
  }, 5); 
  
}

document.onload = function(){
	
}

function handleSomeDiv(someDiv, mutations) { 
    //console.log("div was handled");
    //console.log("memes: ", mutations[0].addedNodes[0].innerText)
    var chev = document.querySelector("#info_panel > div > div > div > div:nth-child(2) > div:nth-child(1) > div > button > div").firstChild.className
    if (mutations[0].addedNodes[0].innerText.includes('File Info') && !chev.includes('down')){
    addInfo()
    }
    
    //mutationInstance.disconnect();
}
function handleMetaDiv(someDiv, mutations){
	 var chev = someDiv.firstChild.lastChild.firstChild.lastChild.className
 
    if (!chev.includes('down')){
    styleMeta(someDiv)
    }else if(mutations[2].target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerText.includes('Meta Data') && !chev.includes('down')){
    styleMeta(someDiv)
    }
}

const memserver = new MutationObserver(function (mutations, mutationInstance) {
    const someDiv = document.querySelector("#info_panel > div > div > div > div:nth-child(2) > div:nth-child(1)")
    const secDiv = document.querySelector("#info_panel > div > div > div > div:nth-child(3) > div:nth-child(1)")
    try {if (someDiv.innerText.includes('File Info')) {
        handleSomeDiv(someDiv, mutations);
        //mutationInstance.disconnect();
    }else if (someDiv.innerText.includes('Meta Data')){

    	handleMetaDiv(someDiv, mutations)
    }
   }catch(err){}
   try {if (secDiv.innerText.includes('Meta Data')){

   	handleMetaDiv(secDiv, mutations)
   }}catch(err){}
});


memserver.observe(document, {
    childList: true,
    subtree:   true
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

try{
  document.querySelector("#orbit_content > div > div.desktop-container.vertical_layout.vertical_fit > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button").addEventListener("click", function(){
    if (document.querySelector("#orbit_content > div > div.desktop-container.vertical_layout.vertical_fit > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button").style.backgroundColor == "initial"){
        setTimeout(function(){
          infoPanels = document.querySelector("#info_panel").firstChild.firstChild.firstChild.childNodes
          for (var x in infoPanels){
            try{
              if (infoPanels[x].firstChild.innerText == "File Info"){
              infoPanel = infoPanels[x]
            }
            }catch(err){
              
            }
            
          }
          
          if (infoPanel.firstChild.firstChild.firstChild.firstChild.firstChild.className == "mdi mdi-chevron-up")
            addInfo()
        }, 150); 
      	
    }else if(document.querySelector("#orbit_content > div > div.desktop-container.vertical_layout.vertical_fit > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button").style.backgroundColor == "rgba(9, 69, 97, 0.098)"){
        removeRows()
    }
})
}catch(err){
  //infopanel not on page
}

     
