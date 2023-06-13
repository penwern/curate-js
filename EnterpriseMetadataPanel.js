<template id="sidecarFileTemplate">
  <div class="sidecar-file">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M9 2.00318V2H19.9978C20.5513 2 21 2.45531 21 2.9918V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L9 2.00318ZM5.82918 8H9V4.83086L5.82918 8ZM11 4V9C11 9.55228 10.5523 10 10 10H5V20H19V4H11Z"></path></svg>
    <span id="sidecarLabel"></span>
    <svg class="sidecar-open"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M10 3V5H5V19H19V14H21V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H10ZM17.5858 5H13V3H21V11H19V6.41421L12 13.4142L10.5858 12L17.5858 5Z" fill="rgba(144,144,144,1)"></path></svg>
  </div>
</template> 
<template id="curateMetadataPanel">
  <style>
  /*move this to brand css*/
  
/*CSS*/
  .metadataPanel-accordion {
    margin-top: 1em !important;
    margin-bottom: 1em !important;
  }

  .metadataPanel-accordion-item {
    background: linear-gradient(white, white) padding-box,
      linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box;
    border: 2px solid transparent;
    border-radius: 0.5em;
    margin-bottom: 0.5em !important;
    overflow: hidden;
  }

  .metadataPanel-accordion-header {
    background-color: #f6f6f6;
    padding: 0.9em !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 0.5em;
    font-size: 1em;
    cursor: pointer; 
  }

  .metadataPanel-accordion-icon {
    width: 1.5em;
    height: 1.5em;
    background-color: #EFEEEE;
    border-radius: 50%;
    transition: transform 0.3s;
    transform: rotate(0deg);
  }

  .metadataPanel-accordion-content {
    background-color: #fff;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease-out;
  }

  .dropdown-item {
    margin-bottom: 0.5em;
  }

  .metadataPanel-accordion-subfield {
    margin-bottom: 0.5em !important;
  }

  /* Add this style to show the expanded content */
  .metadataPanel-accordion-content.expanded {
    display: block;
    margin: 1em;
  }

  /* Add this style to rotate the icon when expanded */
  .metadataPanel-accordion-icon.expanded {
    transform: rotate(180deg);
  }

  .metadataPanel-accordion-icon::before,
  .metadataPanel-accordion-icon::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.1em;
    height: 0.8em;
    background-color: var(--customerColourPrimary);
    transition: transform 0.3s;
  }

  .metadataPanel-accordion-icon::before {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  .metadataPanel-accordion-icon::after {
    transform: translate(-50%, -50%) scaleX(0.8);
  }

  .metadataPanel-accordion-icon.expanded::after {
    transform: translate(-50%, -50%) rotate(90deg) scaleX(0.8);
  }
    .drop-zone {

  border-radius: 10px;
  background-color: #F5F5F5;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='13' ry='13' stroke='%23B1B1B1FF' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='13' stroke-linecap='square'/%3e%3c/svg%3e");
border-radius: 13px;
  height: 8em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease all 0.3s;
}

.drop-zone p {

  font-size: 16px;
  color:#73d3ff;
  pointer-events:none;
}

.drop-zone input[type="file"] {
  display: none;
}
.dropzone-hover{
  background-color:#Eaeaea;
  color: #5cccff;
}
.dropzone-hover p{
  color: #5cccff;
}
.sidecar-file{
  display:flex;
  padding:0.2em !important;
  margin:0.4em !important;
  border-bottom:1px solid;
  transition: all ease 0.3s;
  cursor:pointer;
}
.sidecar-file :hover {
  color:#5cccff;
}
.sidecar-list{
}
.sidecar-open{
  margin-left:auto;
}
  </style>
<div class="metadataPanel-accordion">
  <div class="metadataPanel-accordion-item" id="tagsSection">
    <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
      <span class="metadataPanel-accordion-title">TAGS</span>
      <span class="metadataPanel-accordion-icon"></span>
    </div>
    <div class="metadataPanel-accordion-content">
      <!-- Dropdown content for Tags section -->
    </div>
  </div>
  <div class="metadataPanel-accordion-item" id="dcSection">
    <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
      <span class="metadataPanel-accordion-title">DC</span>
      <span class="metadataPanel-accordion-icon"></span>
    </div>
    <div class="metadataPanel-accordion-content">
      <!-- Dropdown content for DC section -->
    </div>
  </div>
  <div class="metadataPanel-accordion-item" id="isadSection">
    <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
      <span class="metadataPanel-accordion-title">ISAD(G)</span>
      <span class="metadataPanel-accordion-icon"></span>
    </div>
    <div class="metadataPanel-accordion-content">
      <!-- Dropdown content for ISAD section -->
      <div class="metadataPanel-accordion-subfield" id="isadIdentityStatement">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Identity Statement</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Identity Statement -->

        </div>
      </div>
      <div class="metadataPanel-accordion-subfield" id="isadContext">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Context</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Context -->

        </div>
      </div>
      <div class="metadataPanel-accordion-subfield" id="isadContentAndStructure">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Content And Structure</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Content And Structure -->

        </div>
      </div>
      <div class="metadataPanel-accordion-subfield" id="isadConditionsOfAccessAndUse">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Conditions Of Access And Use</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Conditions Of Access And Use -->

        </div>
      </div>
      <div class="metadataPanel-accordion-subfield" id="isadAlliedMaterials">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Allied Materials</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Allied Materials -->

        </div>
      </div>
      <div class="metadataPanel-accordion-subfield" id="isadNotes">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Notes</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Notes -->

        </div>
      </div>
      <div class="metadataPanel-accordion-subfield" id="isadDescriptionControl">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Description Control</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Description Control -->

        </div>
      </div>
    </div>
  </div>
  <div class="metadataPanel-accordion-item" id="importSection">
    <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
      <span class="metadataPanel-accordion-title">IMPORT</span>
      <span class="metadataPanel-accordion-icon"></span>
    </div>
    <div class="metadataPanel-accordion-content">
      <!-- Dropdown content for Import section -->
            <div class="metadataPanel-accordion-subfield" id="sidecarArea">
        <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
          <span class="metadataPanel-accordion-title">Sidecar Files</span>
          <span class="metadataPanel-accordion-icon"></span>
        </div>
        <div class="metadataPanel-accordion-content">
          <!-- Dropdown content for ISAD Description Control -->
          <div class="sidecar-list">

  
</div>
        </div>
      </div>
      
<div class="drop-zone">
  <p>Drop a file, or browse</p>
  <input type="file" id="file-input" />
</div>

    </div>
  </div>
  <div class="metadataPanel-accordion-item" id="exportSection">
    <div class="metadataPanel-accordion-header" onclick="accordionHeader(this)">
      <span class="metadataPanel-accordion-title">EXPORT</span>
      <span class="metadataPanel-accordion-icon"></span>
    </div>
    <div class="metadataPanel-accordion-content">
      <!-- Dropdown content for Export section -->
    </div>
  </div>
</div>
  <script id="metadataPanelHandlers">
  /*Event handlers and utilities to make modified Curate metadata panel functional
  adds resizing on state change for accordions, state changes for dropzone and all other dropzone functionality*/
  
  // Select all accordion headers
var accordionHeaders = document.querySelectorAll('.metadataPanel-accordion-header');
/*
// Attach click event listener to each accordion header
accordionHeaders.forEach(function (header) {
  header.addEventListener('click', function () {
    console.log("cloick")
    // Get the content and icon elements
    var content = this.nextElementSibling;
    var icon = this.querySelector('.metadataPanel-accordion-icon');

    // Check if the current header is a subfield
    var isSubfield = this.parentElement.classList.contains('metadataPanel-accordion-subfield');

    // Determine the main content element based on whether it's a subfield or not
    var mainContent = isSubfield ? this.parentElement.parentElement : content;

    // Toggle the 'expanded' class on the content and icon elements
    content.classList.toggle('expanded');
    icon.classList.toggle('expanded');

    // Update the max-height of the content based on its expanded state
    if (content.classList.contains('expanded')) {
      content.style.maxHeight = content.scrollHeight*1.1 + 'px';
      adjustMainContentHeight(mainContent, content.scrollHeight);
    } else {
      content.style.maxHeight = null;
      adjustMainContentHeight(mainContent, -content.scrollHeight);
    }
  });
});
*/
  function accordionHeader (e) {
    // Get the content and icon elements
    var content = e.nextElementSibling;
    var icon = e.querySelector('.metadataPanel-accordion-icon');

    // Check if the current header is a subfield
    var isSubfield = e.parentElement.classList.contains('metadataPanel-accordion-subfield');

    // Determine the main content element based on whether it's a subfield or not
    var mainContent = isSubfield ? e.parentElement.parentElement : content;

    // Toggle the 'expanded' class on the content and icon elements
    content.classList.toggle('expanded');
    icon.classList.toggle('expanded');

    // Update the max-height of the content based on its expanded state
    if (content.classList.contains('expanded')) {
      content.style.maxHeight = content.scrollHeight*1.1 + 'px';
      adjustMainContentHeight(mainContent, content.scrollHeight);
    } else {
      content.style.maxHeight = null;
      adjustMainContentHeight(mainContent, -content.scrollHeight);
    }
  }
  // Function to adjust the max-height of the main content element
  function adjustMainContentHeight(mainContent, heightChange) {
    var mainContentHeight = mainContent.style.maxHeight;

    // Update the max-height based on the heightChange value
    if (!mainContentHeight) {
      mainContent.style.maxHeight = mainContent.scrollHeight + heightChange + 'px';
    } else {
      mainContent.style.maxHeight = parseInt(mainContentHeight) + heightChange + 'px';
    }
  }
  //Select dropzone
  var dropzone = document.querySelector(".drop-zone")
  dropzone.addEventListener("dragenter", function(){
    this.classList.toggle('dropzone-hover');
    this.getElementsByTagName('p')[0].textContent='Drop Here';
  })
  dropzone.addEventListener("dragleave", function(){
    this.classList.toggle('dropzone-hover');
    this.getElementsByTagName('p')[0].textContent = 'Drop a file, or browse';
  })
  dropzone.addEventListener("click", function(){
    this.querySelector('#file-input').click(); 
  }) 
  function sidecarHandler(e){
    const fileInput = document.querySelector("#file-input")
    
    
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      if (file.name === "metadata.json") {
        const reader = new FileReader();
        reader.onload = function(e) {
          const contents = event.target.result;
          try {
            const metadata = JSON.parse(contents);
            // Handle the parsed metadata object
            console.log("Parsed metadata:", metadata);
          } catch (error) {
            console.error("Error parsing metadata JSON:", error);
          }
        };
        reader.readAsText(file);
      } else {
        // File is not "metadata.json", add to sidecar files
        PydioApi._PydioRestClient.getAuthToken()
          .then(token =>{
            var nodeId = Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata).uuid
            //Get current sidecar files
            var curSidecarRequest = {
              "Namespace": "usermeta-sidecar-files",
              "NodeUuids": [
                nodeId
              ]
            }
            fetch("https://"+window.location.hostname+"/a/user-meta/search", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
              },
              body: JSON.stringify(curSidecarRequest)
            })
              .then(response => response.json())
              .then(data => {
                // Handle the response data
                var sideId = crypto.randomUUID()
                var preU = pydio.ApiClient.buildPresignedPutUrl("othermeta/"+sideId+":"+file.name)
                if (data.Metadatas) {
                  var curData = JSON.parse(data.Metadatas[0].JsonValue)
                  curData.files.push(sideId+":"+file.name)
                  var newSidecars = curData
                }else{
                  var newSidecars = {"files":[sideId+":"+file.name]}
                }
                preU.then(data => {
                  fetch(data.url, {
                    method: 'PUT',
                    headers: {
                      ...data.headers
                    },
                    body: file // Replace 'file' with the actual file you want to send as the request body
                  })
                    .then(response => {
                      // Handle the response
                      console.log("sidecar file uploaded.");
                      retrieveSidecarInfo()
                    })
                    .catch(error => {
                      // Handle any errors
                      console.error("sidecar file upload error: ",error);
                    });
                })
                var sideCarRequest = createRequestObject(newSidecars,"usermeta-sidecar-files",nodeId)
                fetch("https://"+window.location.hostname+"/a/user-meta/update", {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                  },
                  body: JSON.stringify(sideCarRequest)
                })
                  .then(response => response.json())
                  .then(data => {
                    // Handle the response data
                    console.info("sidecar file successfully added: ",data);
                    
                  })
                  .catch(error => {
                    // Handle any errors
                    console.error('Error updating sidecar files:', error);
                  });

                })
                  .catch(error => {
                  // Handle any errors
                  console.error('Error getting sidecar files:', error);
                });




              })
        
        /*var sidecarFileArea = document.querySelector(".sidecar-list")
        var sidecarFileDiv = document.querySelector("#sidecarFileTemplate").content.cloneNode(true)
        sidecarFileDiv.querySelector("#sidecarLabel").textContent = file.name
        sidecarFileArea.appendChild(sidecarFileDiv)*/
      }
    }
  }
    
  dropzone.addEventListener("change", sidecarHandler)
  document.addEventListener("drop", function(e){
    console.log("drop targ: ", e)
    if (e.target.className !== "drop-zone dropzone-hover"){
      return
    }else{
      e.stopImmediatePropagation()
      document.querySelector("#file-input").files = e.dataTransfer.files;
      sidecarHandler()
      retrieveSidecarInfo()
      e.target.classList.toggle("dropzone-hover")
      e.target.firstElementChild.textContent = "Drop a file, or browse"
    }
  })
  function createRequestObject(value, namespace, nodeid) {
    const requestObject = {
      MetaDatas: [
        {
          NodeUuid: nodeid,
          Namespace: namespace,
          JsonValue: JSON.stringify(value),
          Policies: [
            {
              Action: "READ",
              Effect: "allow",
              Subject: "*"
            },
            {
              Action: "WRITE",
              Effect: "allow",
              Subject: "*"
            }
          ]
        }
      ],
    Operation: "PUT"
  };
  return requestObject;
}
  </script>
</template>
<script id="enterpriseModifyMetadataPanel">
    const isadFieldToAreaMapping  = {
      'isad(g)-reference code(s)': 'Identity Statement',
      'isad(g)-title': 'Identity Statement',
      'isad(g)-date(s)': 'Identity Statement',
      'isad(g)-level of description': 'Identity Statement',
      'isad(g)-extent and medium of the unit of description': 'Identity Statement',
      'isad(g)-name of creator(s)': 'Context',
      'isad(g)-administrative/biographical history': 'Context',
      
      'isad(g)-archival history': 'Context',
      'isad(g)-immediate source of acquisition or transfer': 'Context',
      'isad(g)-scope and content': 'Content And Structure',
      'isad(g)-appraisal, destruction and scheduling information': 'Content And Structure',
      'isad(g)-accruals': 'Content And Structure',
      'isad(g)-system of arrangement': 'Content And Structure',
      'isad(g)-conditions governing access': 'Conditions Of Access And Use',
      'isad(g)-conditions governing reproduction': 'Conditions Of Access And Use',
      'isad(g)-language/scripts of material': 'Conditions Of Access And Use',
      'isad(g)-physical characteristics and technical requirements': 'Conditions Of Access And Use',
      'isad(g)-finding aids': 'Conditions Of Access And Use',
      'isad(g)-existence and location of originals': 'Allied Materials',
      'isad(g)-existence and location of copies': 'Allied Materials',
      'isad(g)-related units of description': 'Allied Materials',
      'isad(g)-publication note': 'Allied Materials',
      'isad(g)-note': 'Notes',
      'isad(g)-archivists note': 'Description Control',
      'isad(g)-rules or conventions': 'Description Control',
      'isad(g)-date(s) of descriptions': 'Description Control',
  };

  const groupFieldsByArea = (fieldString, mapping) => {
    const area = mapping[fieldString] || 'Unknown';
    return area;
  };
  function modifyMetadataPanel(metadataPanel){
      if (metadataPanel.id == "curateMdPanel"){
        return
      }      
      const panelContentParent = metadataPanel.querySelector(".panelContent")
      const panelContent = panelContentParent.firstChild
      const panelContentClone = panelContentParent.firstChild.cloneNode(true)
      const metadataFields = Array.from(panelContent.childNodes)
      const metadataFieldsClone = Array.from(panelContentClone.childNodes)
      const sidecarTemplate = document.querySelector("#sidecarFileTemplate").content.cloneNode(true)
      const metadataPanelTemplate = document.querySelector("#curateMetadataPanel").content.cloneNode(true)
      const dcSection = metadataPanelTemplate.querySelector("#dcSection")
      const isadSection = metadataPanelTemplate.querySelector("#isadSection")
      const importSection = metadataPanelTemplate.querySelector("#importSection")
      const exportSection = metadataPanelTemplate.querySelector("#exportSection")
      const tagsSection = metadataPanelTemplate.querySelector("#tagsSection")
      const lengthMax = metadataFields.length
      if (pydio.UI.themeBuilder.dark == true){
        var bgc = "#465957"
        var icc = "#314243"
        var ddc = "#474747"
        var itc = "linear-gradient(#474747, #474747) padding-box, linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box;"
      }else{
        var bgc = "white"
        var icc = "#e9e7e7"
        var ddc = "white"
        var itc = "linear-gradient(white, white) padding-box, linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box;"
      }
      console.log("active bg colour: ", bgc)
      for (let x=0; x<metadataFieldsClone.length; x++){
          var field = metadataFields[x]
          const fieldName = field.textContent.toLowerCase()
          if (fieldName.includes("dc-")){
              field.className = "dropdown-item"
              dcSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
          }else if(fieldName.includes("isad(g)-")){
              var areaName = groupFieldsByArea(fieldName, isadFieldToAreaMapping).replaceAll(" ","")
              field.className = "dropdown-item"
              isadSection.querySelector("#isad"+areaName).querySelector(".metadataPanel-accordion-content").appendChild(field)
          }else if(fieldName.includes("import-")){
              field.className = "dropdown-item"
              importSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
          }else if(fieldName.includes("export-")){
              field.className = "dropdown-item"
              exportSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
          }else if(fieldName.includes("custom tags")){
              tagsSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
          }else{
              field.remove()
          }
      }
      if (metadataPanel.parentElement.childElementCount == 1){
        metadataPanelTemplate.querySelector(".metadataPanel-accordion").style.overflowY = "auto"
        metadataPanelTemplate.querySelector(".metadataPanel-accordion").style.maxHeight = "50em"
      }
      panelContentParent.removeChild(panelContentParent.firstChild)
      panelContentParent.appendChild(metadataPanelTemplate)
     if (metadataPanel.tagName == "DIV"){
       metadataPanel.addEventListener("click", function(){this.id=null})
     }
     const aHeaders = Array.from(document.querySelectorAll(".metadataPanel-accordion-header"))
     aHeaders.forEach(header => {
      header.style.backgroundColor = bgc
      })
     const aIcons = Array.from(document.querySelectorAll(".metadataPanel-accordion-icon"))
     aIcons.forEach(icon =>{
      icon.style.backgroundColor = icc
     })
    const adItems = Array.from(document.querySelectorAll(".dropdown-item"))
    adItems.forEach(item=>{item.style.backgroundColor=ddc})
    const aItems = Array.from(document.querySelectorAll(".metadataPanel-accordion-item"))
    aItems.forEach(item=>{item.style.background=itc})
      retrieveSidecarInfo(metadataPanel)
    
  }
  const metadataPanelCallback = (e,metadataObserver) => {
    var p = false

    e.forEach(m=>{
      if (Object.keys(m.addedNodes).length == 0){
        return
      }
      if (m.addedNodes[0].className !== "panelCard"){
        return
      }
      p = true
    })
    if(p==false){
      return
    }
    const panels = document.querySelectorAll('.panelCard');
    panels.forEach(panel =>{
      if (panel.innerText.includes("Meta Data") && panel.id !== "curateMdPanel"){
        const metadataPanel = panel
        metadataPanel.firstChild.addEventListener("click", e=>{
          if(metadataPanel.querySelector(".panelContent")){
          }else{
            const collapseInterval = setInterval(()=>{
              if (metadataPanel.querySelector(".panelContent")){
                clearInterval(collapseInterval)
                modifyMetadataPanel(metadataPanel)
                metadataPanel.id = "curateMdPanel"
              }
            },20)

            }
        })
        
        if(metadataPanel.querySelector(".panelContent") && metadataPanel.id !== "curateMdPanel"){
          const panelContent = metadataPanel.querySelector(".panelContent").firstChild
          if (!panelContent.children){
            return
          }
          const interval = setInterval(() => {
            if (panelContent.children.length > 2) {
              clearInterval(interval);
              //modify it
              
              modifyMetadataPanel(metadataPanel)
              metadataPanel.id = "curateMdPanel"
            }
          }, 50);
          
        }
      }
    });
  }
  const retrieveSidecarInfo=(metadataPanel)=>{

    if (metadataPanel.tagName == "DIV"){
      
      var target = metadataPanel
    }else{
      var target = document 
    }
    if (pydio._dataModel._selectedNodes.length == 0){

      return
    }
    if(!target.querySelector(".sidecar-list")){

      return
    }
    else{

      Array.from(target.querySelector(".sidecar-list").children).forEach(c=>{
        c.remove()
      })
      if (!Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"]){
        if (target.querySelector("#sidecarArea")){
           target.querySelector("#sidecarArea").style.display = "none"
        }
        return
      }
      if (Object.keys(Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"]).length == 0 && target.querySelector("#sidecarArea")){
        target.querySelector("#sidecarArea").style.display = "none"
        return
      }
      target.querySelector("#sidecarArea").style.display = "block"
      let scs = Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"].files
      if (!scs){
        return
      }
      if (scs.length == 0){
        return
      }
      scs.forEach(scf => {
        var scfs = scf.length > 15 ? scf.split(":")[1].substring(0, 15).trim() + "..." : scf;
        var scft = document.querySelector("#sidecarFileTemplate").content.cloneNode(true)
        scft.addEventListener("click", e=>{
          //get file and render in codemirror
          
        })
        scft.querySelector("#sidecarLabel").textContent = scfs
        scft.querySelector("#sidecarLabel").title = scf
        target.querySelector(".sidecar-list").appendChild(scft) 
      })
    } 
    if(target.querySelector(".sidecar-list").parentElement.classList.contains("expanded")){
      let content = target.querySelector(".sidecar-list").parentElement
      content.style.maxHeight = content.scrollHeight*1.1 + 'px';
      let p = content.parentElement.parentElement
      adjustMainContentHeight(p, content.scrollHeight);
    }
    
 }
 const wsCallback=(mutationsList, observerInstance)=>{
   for (let mutation of mutationsList) {
     if (mutation.type === 'childList') {
       // Check if any added nodes have the title "OtherMeta"
       mutation.addedNodes.forEach((addedNode) => {
         if (addedNode.tagName !== "DIV"){
           return
         }
         if (addedNode.querySelector('[title="OtherMeta"]')) {
           // Hide the parent element by setting its display property to "none"
           document.querySelector('[title="OtherMeta"]').parentElement.style.display = "none"
         }
       });
     }
   }  
 }
  window.addEventListener("load",l=>{
      const metadataObserver = new MutationObserver(function(e){metadataPanelCallback(e,metadataObserver)});
      metadataObserver.observe(document.body, { subtree: true, childList: true });
      // Create a new instance of the MutationObserver
      const wsObserver = new MutationObserver(wsCallback);
      wsObserver.observe(document.body, {childList: true, subtree: true });
      
      const interval = setInterval(() => {
        if (pydio) {
          clearInterval(interval);
          pydio._dataModel.observe("selection_changed",retrieveSidecarInfo)
         
        }
      }, 50);
      
  })
</script>
