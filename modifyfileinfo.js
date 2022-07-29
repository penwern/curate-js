function reqListener () {
  console.log(this.responseText);
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
		var vscan = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["usermeta-virus-scan"]
    var vscan2 = Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["usermeta-second-virus-scan"]
      //console.log("no scan result") 
      var arr = [vscan, vscan2]
      for (var a in arr){
      	if(arr[a]==undefined){
        	arr[a] = 'File has not been scanned'
        }
      }
      return arr
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
    
    if (container.textContent.includes('File Info')&& !container.lastChild.textContent.includes('File Info')){
    	container.removeChild(container.lastChild)
      }
      xpanel++
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
  if(scan.toLowerCase().includes('passed') && scan2.toLowerCase().includes('passed')){
    status = 'Released'
    }
  if(status==undefined){status= 'Risk'}
  addFileInfo(pid, scan,scan2, tag, mime, status)
}




var lastmutation = {}
var attempts = 0
const memer = new MutationObserver((mutations, memer) => {
	console.log("memer: ", mutations)
})
const observer = new MutationObserver((mutations, observer) => {
//console.log(mutations)
var source
	
	for (var recordno in mutations){
  		var recordselected = mutations[recordno].target.selected
			var target = mutations[recordno].target.className
      //console.log(target.class)
      //console.log("curr: ", mutations[recordno].target.id)
      try {if (target.includes('chevron-')){
      	source = mutations[recordno].target.parentElement.parentElement.parentElement.parentElement.innerText
        }
        }catch(err){}
      try {if (target.includes('chevron-down') && source == 'File Info'){
      	//console.log(mutations[recordno])
        
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
      
      let newinfodivTag = document.createElement("div")
      newinfodivTag.class = "infoPanelRow"
      newinfodivTag.style.padding = "0px 16px 6px"
      let newinfolabelTag = document.createElement("div");
      newinfolabelTag.class = "infoPanelLabel"
      newinfolabelTag.style.fontWeight = '415'
      newinfolabelTag.textContent = "Checksum"
      let newinfovalueTag = document.createElement("div");
      newinfovalueTag.class = "infoPanelValue"
      newinfovalueTag.textContent = etag
      newinfodivTag.appendChild(newinfolabelTag)
      newinfodivTag.appendChild(newinfovalueTag)
      
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
      
      newRows.appendChild(newinfodivMime)
      newRows.appendChild(newinfodivPronom)
      newRows.appendChild(newinfodivTag)
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

const memserver = new MutationObserver(function (mutations, mutationInstance) {
    const someDiv = document.querySelector("#info_panel > div > div > div > div:nth-child(2) > div:nth-child(1)")
    try {if (someDiv.innerText.includes('File Info')) {
        handleSomeDiv(someDiv, mutations);
        //mutationInstance.disconnect();
    }
   }catch(err){}
});


memserver.observe(document, {
    childList: true,
    subtree:   true
});

observer.observe(document, {
  subtree: true,
  attributes: true
});
