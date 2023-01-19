var dcVals = {}
var isadVals = {}
var r=0
var dcFields = ["dc-title", "dc-creator", "dc-description", "dc-contributor", "dc-coverage", "dc-date", "dc-format", "dc-identifier", "dc-language", "dc-publisher", "dc-relation", "dc-rights", "dc-source", "dc-subject", "dc-type"]
var isadFields = ["isadg-reference-codes","isadg-title","isadg-dates","isadg-level-of-description","isadg-extent-and-medium-of-the-unit-of-description","isadg-name-of-creators","isadg-administrativebibliographical-history","isadg-archival-history","isadg-immediate-source-of-acquisition-or-transfer","isadg-scope-and-content","isadg-appraisal-destruction-and-scheduling-information","isadg-accruals","isadg-system-of-arrangement","isadg-conditions-governing-access","isadg-conditions-governing-reproduction","isadg-languagescripts-of-material","isadg-physical-characteristics-and-technical-requirements","isadg-finding-aids","isadg-existence-and-location-of-originals","isadg-existence-and-location-of-copies","isadg-related-units-of-description","isadg-publication-note","isadg-note","isadg-archivists-note","isadg-rules-or-conventions","isadg-dates-of-descriptions"]

var isadDCMap = {"dc-title":"isadg-title","dc-creator":"isadg-name-of-creators","dc-description":"isadg-scope-and-content","dc-contributor":"","dc-coverage":"","dc-date":"isadg-dates","dc-format":"isadg-extent-and-medium-of-the-unit-of-description","dc-identifier":"isadg-reference-codes","dc-langauge":"","dc-publisher":"","dc-relation":"","dc-rights":"","dc-source":"","dc-subject":"","dc-type":""}
function fA(e, t){
  e.style.visibility = "visible"
  e.textContent = t
  setTimeout(function(){
    e.classList.add("flyAway")
    setTimeout(function(){
      e.remove()
    }, 2000)
  },1)
  
}
function mTog(e, dcO){
  if (document.querySelector("#fanm")){
    document.querySelector("#fanm").remove()
  }
  let tdlT = document.createElement("div")
  tdlT.id = "fanm"
  tdlT.style="visiblity:hidden;position:relative;top:-1em;left:0.7em;transition:transform 0.5s ease,opacity 2s ease-out;font-size:10pt;width:max-content;"
  e.srcElement.parentElement.prepend(tdlT)
  let linkI =  document.querySelector("#"+e.srcElement.id)
  let lDc = e.srcElement.parentElement.previousElementSibling.lastElementChild.value
  let lDi = e.srcElement.parentElement.nextElementSibling.lastElementChild.id.substring(1)
  if (linkI.alt == 'LINKED'){
    linkI.src = "https://i.ibb.co/kD5R0vy/UNLINKED.png"
    linkI.alt = 'UNLINKED'
    //console.log(e.srcElement)
    fA(tdlT, "Unlinked")
    e.srcElement.parentElement.nextElementSibling.lastElementChild.value = dcO[lDi]
  }else{
    linkI.src = "https://i.ibb.co/Jj9psth/LINKED.png"
    linkI.alt = 'LINKED'
    //console.log(e.srcElement)
    fA(tdlT, "Linked")
    e.srcElement.parentElement.nextElementSibling.lastElementChild.value = lDc
  }
}
function cMEl(dc, isad){
    //console.log("dc",dc)
    //console.log("isad",isad)
  let tr = document.createElement("tr")
  tr.style.marginBottom = "1em"
  let tdi = document.createElement("td")
  tdi.className = "dcisadTd"
  let tdiL = document.createElement("label")
  tdiL.style.whiteSpace = "nowrap"
  tdiL.style.overflow = "hidden"
  tdiL.style.width = "230px"
  tdiL.style.position = "relative"
  tdiL.style.top = "0.2em"
  tdiL.style.textOverflow = "ellipsis"
  tdiL.style.display = "inline-block"
  tdiL.for = "r"+isad[1]
  let l = isad[1].replace('isadg','isad(g)').split("-")
  //console.log(l)
  l = (l[0].toUpperCase()+"-")+(l[1].charAt(0).toUpperCase())+(l[1].slice(1))+' '+((l.slice(2)).join(' '))
  tdiL.textContent = l
  let tdiI = document.createElement("input")
  tdiI.id = "r"+isad[1]
  tdiI.style.width = "inherit"
  tdiI.disabled = true
  tdiI.value = isad[0]
  tdiI.style.paddingLeft = "0.2em"
  tdi.appendChild(tdiL)
  tdi.appendChild(tdiI)
  let tdl = document.createElement("td")
  tdl.className = "dcisadLTd"

  let tdlI = document.createElement("img")
  tdlI.id = dc.replace('-','')+"Link"
  tdlI.src = "https://i.ibb.co/Jj9psth/LINKED.png"
  tdlI.alt = "LINKED"
  tdlI.className = "dcisadL"
  var dcO = {}
    for (let v in dcFields){
        dcO[document.querySelector('#'+dcFields[v]).id] = document.querySelector('#'+dcFields[v]).value
    }
  tdlI.addEventListener("click", function(){mTog(event,dcO)})
  tdlI.border="0"
  
  tdl.appendChild(tdlI)
  let tdd = document.createElement("td")
  tdd.className = "dcisadTd"
  let tddL = document.createElement("label")
  tddL.for = "r"+dc
  l = dc.split("-")
  l = (l[0].toUpperCase()+"-")+(l[1].charAt(0).toUpperCase())+(l[1].slice(1))
  tddL.textContent = l
  let tddI = document.createElement("input")
  tddI.disabled = true
  tddI.id = "r"+dc
  tddI.style.width = "inherit"
  tddI.value = isad[0]
  tddI.style.paddingLeft = "0.2em"
  tdd.appendChild(tddL)
  tdd.appendChild(tddI)
  tr.appendChild(tdi)
  tr.appendChild(tdl)
  tr.appendChild(tdd)
  return tr
}
function sugGH(map){
  let t = document.createElement("table")
  t.className = "mWTable"
  for (let m in map){
    if (map[m] == "no value" || map[m] == "no map"){
      continue
    }else{
      t.appendChild(cMEl(m, map[m]))
    }
  }
  cwSwal(t)
}
function cwSwal(t){
    swal.fire({
        title:"Select terms to crosswalk",
        html:t,
        width:800,
        showCloseButton: true,
        confirmButtonText: "Save mapping",
        padding:"2em",
        preConfirm: function(){
            let wRows = document.querySelector("#swal2-html-container > table").rows
            for (var a of wRows){
              //console.log("column title: ", a.lastChild.textContent)
              //console.log("column value: ", a.lastChild.lastChild.value)
              document.querySelector("#"+a.lastChild.textContent.toLowerCase()).value = a.lastChild.lastChild.value
             
            }
          saveHandler()
        }
    })
}
function isTDCdW(){
    let isdcM = JSON.parse(JSON.stringify(isadDCMap))
    for (let is in isadDCMap){
        if (isadDCMap[is] !==''){
            let iv = document.querySelector('#'+isadDCMap[is]).value
            if (iv !== ''){
                isdcM[is] = [iv,isadDCMap[is]]
            }else {
                //console.log("no value to map")
                isdcM[is] = "no value"
            }
        }else {
            console.log("no mapping established")
            isdcM[is] = "no map"
        }
    }
    //console.log("Mapped DC: ", isdcM)
    sugGH(isdcM)
}
function cWB(){
  let t = document.querySelector("#cWB")
  if (t == null){
    let cWB = document.createElement("button")
    cWB.id = "cWB"
    cWB.innerHTML = '<i class="icon-link menu-icons" style="color:gray";></i>'
    cWB.classList.add("pBtnStyle2")
    cWB.onclick = function(){
      var cwMap = {"":""}
      //console.log("crosswalking")
      var cwA = []
      isTDCdW()
      for (let v in isadFields){
        cwA.push(document.querySelector('#'+isadFields[v]).value)
      }
    }
    let cwT = document.createElement("text")
    cwT.textContent = "Crosswalk from ISAD"
    cwT.classList.add("cwT")
    cWB.append(cwT)
    let cwD = document.createElement("div")
    cwD.append(cWB)
    document.querySelector("#dc-container > ul").prepend(cwD)
  }
}


function isadDivs(areas){
    for (var x in areas){
        let div = document.createElement("div")
        div.id = "isad-"+areas[x].replaceAll(' ','-')+"-area"
        let mdsSelector = document.createElement("input")
        let mdsLabel = document.createElement("label")
        let labelSpan = document.createElement("span")
        let ul = document.createElement("ul")
        ul.className = "mdsSlide"
        labelSpan.id = "mdsSpan-"+(areas[x].replaceAll(' ','-'))
        labelSpan.setAttribute("state-icon", "+")
        labelSpan.addEventListener("click", function(){
          if (labelSpan.getAttribute("state-icon") == "+"){
            labelSpan.setAttribute("state-icon", "-")
          }else {
            labelSpan.setAttribute("state-icon", "+")
          }
        })
        mdsLabel.addEventListener("click", function(){
          if (labelSpan.getAttribute("state-icon") == "+"){
            labelSpan.setAttribute("state-icon", "-")
          }else {
            labelSpan.setAttribute("state-icon", "+")
          }
        })
        labelSpan.className = "mdsSpan2"
        labelSpan.textContent = areas[x]
        mdsLabel.appendChild(labelSpan)
        mdsSelector.type = "checkbox"
        mdsSelector.name = "schema-"+areas[x]
        mdsSelector.className = "checkbox-isadg2"
        mdsSelector.id = "checkbox-isadg"+x

        mdsLabel.htmlFor = mdsSelector.id
   
        div.appendChild(mdsLabel)
        div.appendChild(mdsSelector)
        div.appendChild(ul)
        document.querySelector("#isadg-container").lastChild.appendChild(div)
    }
}
function isadMap(isadLis){
    let iAreas = {0:"identity statement", 1:"context", 2:"content and structure", 3:"conditions of access and use", 4:"allied materials", 5:"notes", 6:"description control"}
    let iEls = [{"element":"reference code(s)", "areaId":0}, {"element":"title", "areaId":0}, {"element":"date(s)", "areaId":0}, {"element":"level of description", "areaId":0}, {"element":"extent and medium of the unit of description", "areaId":0}, {"element":"name of creator(s)", "areaId":1}, {"element":"administrative/bibliographical history", "areaId":1}, {"element":"archival history", "areaId":1}, {"element":"immediate source of acquisition or transfer", "areaId":1}, {"element":"scope and content", "areaId":2}, {"element":"appraisal, destruction and scheduling information", "areaId":2}, {"element":"accruals", "areaId":2}, {"element":"system of arrangement", "areaId":2}, {"element":"conditions governing access", "areaId":3}, {"element":"conditions governing reproduction", "areaId":3}, {"element":"language/scripts of material", "areaId":3}, {"element":"physical characteristics and technical requirements", "areaId":3}, {"element":"finding aids", "areaId":3}, {"element":"existence and location of originals", "areaId":4}, {"element":"existence and location of copies", "areaId":4}, {"element":"related units of description", "areaId":4}, {"element":"publication note", "areaId":4}, {"element":"note", "areaId":5}, {"element":"archivists note", "areaId":6}, {"element":"rules or conventions", "areaId":6}, {"element":"date(s) of descriptions", "areaId":6}]
    isadDivs(iAreas)
    for (var el in isadLis){
        checkT = isadLis[el].firstChild.innerHTML.toLowerCase()
        for (var x in iEls){
            if (checkT.includes(iEls[x].element.toLowerCase())){
                let a = iAreas[iEls[x].areaId].replaceAll(' ','-')
                let divId = "#isad-"+a+"-area"
                document.querySelector(divId).lastChild.appendChild(isadLis[el])
            }
        }
    }
}
function getDc(){
    let t = {}
    
    for (let f in dcFields){
        let v = document.querySelector("#"+dcFields[f]).value
        t[dcFields[f]] = v
    }
    return t
}
function getIsad(){
    let t = {}
    
    for (let f in isadFields){
        let v = document.querySelector("#"+isadFields[f]).value
        t[isadFields[f]] = v
    }
    return t
}
function saveListener(ev){
    if (ev.status = 200){
        console.log("saved")
        //let eN = "usermeta-"+Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata).uuid
        //let eV = JSON.stringify(Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata))
        //sessionStorage.setItem(eN, eV)
        //console.log(sessionStorage.getItem(eN))
        if (document.querySelector("#mdsSave")){
          document.querySelector("#mdsSave").parentElement.remove()
        }  
    }
}
function compareGet(o, n){
    cO = {}
    for (var el in o){
        if (n[el] == o[el]){
            continue
        }else{
            //let p =  '"\\"' + n[el] + '\\""'
            cO[el] = JSON.stringify(n[el])
        }
    }
    return cO
}
function saveHandler(ev){
    let n = {}
    Object.assign(n, getDc(), getIsad())
    let o = {}
    Object.assign(o, dcVals, isadVals)
    let c = compareGet(o, n)
    let nodeid = Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata).uuid
    let loads = []
    let mLoad = {}
    let eV = {}
    let eN = "usermeta-"+Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata).uuid
    for (var m in c){
        let nspace = "usermeta-"+m.toLowerCase()
        let jsnVal = c[m]
        
        pydio._dataModel._selectedNodes[0]._metadata.set(nspace,jsnVal)
        //console.log(Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata))
        
        //let eV = JSON.stringify(Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata))
        eV[m] = jsnVal
        //console.log(sessionStorage.getItem(eN))
        let payloadX = {"NodeUuid":nodeid, "Namespace": nspace, "JsonValue":jsnVal, "Policies":[{"Action":"READ","Effect": "allow","Subject": "*"},{"Action": "WRITE","Effect": "allow","Subject": "*"}]}
        loads.push(payloadX)
    }
    sessionStorage.setItem(eN, JSON.stringify(eV))
    //console.log(sessionStorage.getItem(eN))
    mLoad["MetaDatas"] = loads
    mLoad["Operation"] = "PUT"
    let s = new XMLHttpRequest();
    s.addEventListener("load", saveListener);
    s.open("PUT", "/a/user-meta/update");
    s.setRequestHeader('Content-Type', 'application/json')
    s.setRequestHeader('Authorization', "Bearer " + PydioApi._PydioRestClient.authentications.oauth2.accessToken)
    s.send(JSON.stringify(mLoad));
}
function inputHandler(ev){
    let mds = document.querySelector("#mdsCont")
    //try{
        let x = mds.parentNode.lastChild
        if (x.innerHTML.includes("Save")){
            return
        }else{
            let saveBtn = document.createElement("div")
            saveBtn.innerHTML = '<div id=mdsSave style="padding: 2px; text-align: right; border-top: 1px solid rgb(224, 224, 224);"><button tabindex="0" type="button" style="border: 10px; box-sizing: border-box; display: inline-block; font-family: Roboto, sans-serif; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; text-decoration: none; margin: 0px; padding: 0px; outline: none; font-size: inherit; font-weight: inherit; position: relative; height: 36px; line-height: 36px; min-width: 88px; color: rgba(0, 0, 0, 0.87); transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms; border-radius: 2px; user-select: none; overflow: hidden; background-color: rgba(0, 0, 0, 0); text-align: center;"><div><span>You have unsaved changes!<span style="position: relative; padding-left: 16px; padding-right: 16px; vertical-align: middle; letter-spacing: 0px; text-transform: uppercase; font-weight: 500; font-size: 14px;">Save meta</span></div></button></div>'
            saveBtn.addEventListener("click",saveHandler)
            mds.parentNode.appendChild(saveBtn) 
        } 
}
function schemaToLi(type, target, els){
    let isadG = []
   for (let el in els){
       let mdsLi = document.createElement("li")
       if (typeof(els[el]) !== "object"){
           continue
       }else if (els[el].innerHTML.includes('DC') && type == "dc"){
           let mNode = els[el].cloneNode(true)
           let z = mNode.firstChild.firstChild.textContent.toLowerCase()
           mNode.addEventListener("input", inputHandler)
           if (mNode.firstChild.children[1].nodeName == "INPUT"){
               mNode.firstChild.children[1].id = z
               var cont = mNode.firstChild.children[1].value
           }else if (mNode.firstChild.children[1].lastChild.nodeName == "TEXTAREA"){
                mNode.firstChild.children[1].lastChild.id = z
                var cont = mNode.firstChild.children[1].lastChild.value
           }
           dcVals[z] = cont
           mdsLi.appendChild(mNode)
           target.appendChild(mdsLi)
       }else if (els[el].innerHTML.includes('ISAD') && type == 'isadg'){
           let mNode = els[el].cloneNode(true)
           let z = mNode.firstChild.firstChild.textContent.replaceAll('(G)','G').replaceAll('(s)','s').replaceAll(' ','-').replaceAll('/','').replaceAll(',','').replaceAll("'",'').toLowerCase()
           mNode.addEventListener("input", inputHandler)
           mNode.firstChild.firstChild.textContent = mNode.firstChild.firstChild.textContent.replace('ISAD(G)-','')
           if (mNode.firstChild.children[1].nodeName == "INPUT"){
               mNode.firstChild.children[1].id = z
               var cont = mNode.firstChild.children[1].value
           }else if (mNode.firstChild.children[1].lastChild.nodeName == "TEXTAREA"){
                mNode.firstChild.children[1].lastChild.id = z
                var cont = mNode.firstChild.children[1].lastChild.value
           }
           isadVals[z] = cont
           mdsLi.style.marginLeft = "15px"
           mdsLi.style.paddingLeft = "15px"
           mdsLi.appendChild(mNode)
           isadG.push(mdsLi)
           //target.appendChild(mdsLi)
       }
   }
    if (type == 'isadg'){isadMap(isadG)}
    return target
}
function clearFields(){
    let f = dcFields.concat(isadFields)
    f.forEach(function(a){
        document.querySelector('#'+a).value = ''
    })
}
function tM(ev){
    if (ev.target.parentNode.innerHTML.includes('down')){
    }else{
         let infoArea = document.querySelector("#info_panel > div > div.scrollarea-content > div")
    for (var panel in infoArea.children){
        if (typeof(infoArea.children[panel]) !== "object"){
          continue;
        }else if (infoArea.children[panel].innerHTML.includes('Meta Data')){
            var metaCont = infoArea.children[panel]
            metaCont.removeChild(metaCont.lastChild)
    }
    }
  }
}
function cyB(){
  let t = document.querySelector("#cyB")
  if (t == null){
    let b = document.createElement("input")
    b.type = "button"
    b.value = "&#x1F4CB;"
  }
}
function uDfC(e){
  let eN = "usermeta-"+Object.fromEntries(e._metadata).uuid
  let rM = JSON.parse(sessionStorage.getItem(eN))
  //console.log("rm: ", rM)
  setTimeout(function(){
    for (var x in rM){
      //console.log("#"+x.replace("usermeta-",""))
      document.querySelector("#"+x.replace("usermeta-","")).value = JSON.parse(rM[x])
  }
  },10) 
}
function oHm(e){
  setTimeout(function(){
    if (!document.querySelector('#checkbox-dc')){
    setTimeout(function(){
      try{
        if (document.querySelector("#info_panel > div > div > div > div:nth-child(3)").lastChild.className == "panelContent"){
        //console.log("already open")
      }
      else{
        document.querySelector("#info_panel > div > div > div > div:nth-child(3)").firstElementChild.click()
      }
      //console.log("waited")
      oH()
      cWB()
      uDfC(pydio._dataModel._selectedNodes[0])
      }catch(n){
        
      }
    },300)
  }
  else{
    //console.log("didn't wait")
    if (e){
      oH() 
      cWB()
      uDfC(pydio._dataModel._selectedNodes[0])
    } 
  } 
  },200)
  
}    
function oH(ev){
    let infoArea = document.querySelector("#info_panel > div > div.scrollarea-content > div")
    for (var panel in infoArea.children){
        if (typeof(infoArea.children[panel]) !== "object"){
          continue;
        }else if (infoArea.children[panel].innerHTML.includes('Meta Data')){
            var metaCont = infoArea.children[panel]
            var metaPanel = infoArea.children[panel].lastChild.firstChild
            if (metaCont.lastChild.id == 'mdsCont'){
                let oM = Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)
                clearFields()
                for (let t in oM){
                    if (t.includes('usermeta-dc') || t.includes('usermeta-isad')){
                        let f = t.replace('usermeta-','')
                        document.querySelector('#'+f).value = oM[t]
                    }
                }
            }else {
              //console.log("the metaCont: ", metaCont)
              var schemas = ["dc", "isadg"]
              var mdsContainer = document.createElement("div")
              mdsContainer.id = "mdsContainer"
              const chil = metaPanel.children
              //console.log(chil)
              metaCont.removeChild(metaCont.lastChild)
              metaCont.appendChild(mdsContainer)
              for (let el in schemas){
                let sContainer = document.createElement("div")
                sContainer.id = schemas[el]+"-container"
                //console.log("scont: ", sContainer)
                let mdsSelector = document.createElement("input")
                let mdsLabel = document.createElement("label")
                let labelSpan = document.createElement("span")
                labelSpan.onclick = function(){
                  if (labelSpan.getAttribute("state-icon") == "+"){
                    labelSpan.setAttribute("state-icon","-")
                  }else{
                    labelSpan.setAttribute("state-icon","+")
                  }
                }
                let ul = document.createElement("ul")
                ul.className = "mdsSlide"
                labelSpan.id = "mdsSpan-"+(el.replaceAll(' ', '-'))
                labelSpan.setAttribute("state-icon", "+")
                labelSpan.className = "mdsSpan"
                labelSpan.textContent = schemas[el].toUpperCase()
                mdsLabel.appendChild(labelSpan)
                mdsSelector.type = "checkbox"
                mdsSelector.name = "schema-"+schemas[el]
                mdsSelector.id = "checkbox-" + schemas[el]

                mdsLabel.htmlFor = mdsSelector.id

                sContainer.appendChild(mdsLabel)
                sContainer.appendChild(mdsSelector)
                sContainer.appendChild(ul)
                mdsContainer.appendChild(sContainer)
                mdsContainer.id = "mdsCont"
                ul = schemaToLi(schemas[el],ul, chil)
                if (r == 0){  
                  metaCont.firstChild.firstChild.remove()
                  r = metaCont.firstChild.cloneNode()
                  r.innerText = "Meta Data"
                  r.style.cursor = "default"
                  metaCont.firstChild.replaceWith(r)
                }
              }
            } 
    //let x = metaPanel.childElementCount  
        }
    }
}
function pasteHandler(t,r){
  let nodeid = Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata).uuid
  let loads = []
  let mLoad = {}
  for (let x in r){
    let payloadX = {"NodeUuid":t, "Namespace": x, "JsonValue":JSON.stringify(r[x]), "Policies":[{"Action":"READ","Effect": "allow","Subject": "*"},{"Action": "WRITE","Effect": "allow","Subject": "*"}]}
    loads.push(payloadX)
   }
   mLoad["MetaDatas"] = loads
   mLoad["Operation"] = "PUT"
   let s = new XMLHttpRequest();
   s.addEventListener("load", saveListener);
   s.open("PUT", "/a/user-meta/update");
   s.setRequestHeader('Content-Type', 'application/json')
   s.setRequestHeader('Authorization', "Bearer " + PydioApi._PydioRestClient.authentications.oauth2.accessToken)
   s.send(JSON.stringify(mLoad));
}

function storeRMeta(){ 
    let mP = {}
    let nM = pydio._dataModel._selectedNodes[0]._metadata
    nM.forEach(function(r,c){
        if (c.includes("usermeta") && !c.includes("virus")){ //don't copy quarantine info, illegal!
            mP[c] = r
        }
    })
    return mP
}
function addCVh(){
  var copiedMetaR
  document.addEventListener("keydown", function(e){
    if (document.location.pathname.startsWith('/ws-') && !document.querySelector("#application-login")){ //unless we are in a workspace, disable
      let ctrl = e.ctrlKey
      let k = e.which
      if ( ctrl && k == 67){
        console.log("copy")
        pydio.displayMessage("toast","Metadata copied")
        if (pydio._dataModel._selectedNodes.length ==1){
         copiedMetaR = storeRMeta()
        }else{
        pydio.displayMessage("toast","Cannot copy metadata from multiple records")
      }
    }
    if (ctrl && k == 86){
      console.log("paste")
      if (pydio._dataModel._selectedNodes.length >0){
         for (let t in pydio._dataModel._selectedNodes){
           pasteHandler(Object.fromEntries(pydio._dataModel._selectedNodes[t]._metadata).uuid,copiedMetaR)
         }
      }else{pydio.displayMessage("toast","No target for metadata selected")}
    }
  }else{}
  })
}
//main
function gD(){
    var mdsI = setInterval(function(){
    let iP = document.querySelector("#info_panel > div > div.scrollarea-content")
    if (iP !== null){
        var fL = document.querySelector("#orbit_content > div > div.desktop-container.vertical_layout.vertical_fit > div.material-list.vertical-layout.layout-fill.files-list.layout-fill.main-files-list > div > div > div")
        fL.addEventListener("click",function(){
            var mdsIS = setInterval(function(){
                try {
                    for (let z in iP.firstChild.children){
                        if (iP.firstChild.children[z].innerHTML.includes("Meta")){
                            clearInterval(mdsIS)
                            oH()
                        }else{
                            continue
                        }
                    }   
                } catch (error) {
                }
              
            },100)
        })
        clearInterval(mdsI)
        pydio._dataModel.observe("selection_changed", oHm)
    }
}, 200)
}

window.onload = function(){
    setTimeout(function(){
        //pydio.observe("gui_loaded", gD)
        pydio._dataModel.observe("selection_changed", function(){oHm(event)})
        addCVh()
    },500)
}
