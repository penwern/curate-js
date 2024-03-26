(()=>{var e={886:()=>{const e={api:{}};e.api.fetchCurate=async function(e,t,o){try{const r=await PydioApi._PydioRestClient.getOrUpdateJwt(),a={method:t,headers:{accept:"application/json","accept-language":navigator.language+",en-GB,en-US;q=0.9,en;q=0.8",authorization:"Bearer "+r,"content-type":"application/json","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","x-pydio-language":pydio.user.getPreference("lang")},referrer:window.location.href,referrerPolicy:"strict-origin-when-cross-origin",mode:"cors",credentials:"include"};["GET","HEAD"].includes(t)||(a.body=JSON.stringify(o));const n=await fetch(window.location.origin+e,a);if(!n.ok)throw new Error("Network response was not ok");return await n.json()}catch(e){throw console.error("Curate fetch error:",e),e}},e.workspaces={},e.workspaces.getOpenWorkspace=function(){return pydio._dataModel._rootNode._label.toLowerCase()==pydio.user.id.toLowerCase()?"personal-files":pydio._dataModel._rootNode._label.toLowerCase().replace(/^\d+\.\s*/,"")}},748:()=>{const e={"isad(g)-reference code(s)":"Identity Statement","isad(g)-title":"Identity Statement","isad(g)-date(s)":"Identity Statement","isad(g)-level of description":"Identity Statement","isad(g)-extent and medium of the unit of description":"Identity Statement","isad(g)-name of creator(s)":"Context","isad(g)-administrative/biographical history":"Context","isad(g)-archival history":"Context","isad(g)-immediate source of acquisition or transfer":"Context","isad(g)-scope and content":"Content And Structure","isad(g)-appraisal, destruction and scheduling information":"Content And Structure","isad(g)-accruals":"Content And Structure","isad(g)-system of arrangement":"Content And Structure","isad(g)-conditions governing access":"Conditions Of Access And Use","isad(g)-conditions governing reproduction":"Conditions Of Access And Use","isad(g)-language/scripts of material":"Conditions Of Access And Use","isad(g)-physical characteristics and technical requirements":"Conditions Of Access And Use","isad(g)-finding aids":"Conditions Of Access And Use","isad(g)-existence and location of originals":"Allied Materials","isad(g)-existence and location of copies":"Allied Materials","isad(g)-related units of description":"Allied Materials","isad(g)-publication note":"Allied Materials","isad(g)-note":"Notes","isad(g)-archivists note":"Description Control","isad(g)-rules or conventions":"Description Control","isad(g)-date(s) of descriptions":"Description Control"};function t(){if(pydio.UI.themeBuilder.dark)var e="#465957",t="#314243",o="#474747",r="linear-gradient(#474747, #474747) padding-box, linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box",a="#5c5a5a",n="#202529";else e="#f6f6f6",t="#EFEEEE",o="white",r="linear-gradient(white, white) padding-box, linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box",a="#F5F5F5",n="linear-gradient(90deg, var(--customerColourPrimary), var(--customerColourHighlight))";Array.from(document.querySelectorAll(".metadataPanel-accordion-header")).forEach((t=>{t.style.backgroundColor=e})),Array.from(document.querySelectorAll(".metadataPanel-accordion-icon")).forEach((e=>{e.style.backgroundColor=t})),Array.from(document.querySelectorAll(".dropdown-item")).forEach((e=>{e.style.backgroundColor=o})),Array.from(document.querySelectorAll(".metadataPanel-accordion-item")).forEach((e=>{e.style.background=r})),Array.from(document.querySelectorAll(".drop-zone")).forEach((e=>{e.style.backgroundColor=a})),document.querySelector("#workspace_toolbar")&&(document.querySelector("#workspace_toolbar").parentElement.style.background=n)}const o=async()=>{const e=document.createElement("i");e.className="fa fa-circle-o-notch fa-spin",e.id="loader",harvestBtn.prepend(e);let t=document.querySelector("#import-oai-link-id").value,o=document.querySelector("#import-oai-repo-url").value,r=document.querySelector("#import-oai-metadata-prefix").value;const a={baseUrl:o,verb:"GetRecord",identifier:t,metadataPrefix:r,oaiVersion:1},n=await harvestOAI(a);if(console.log(n),!n)return document.querySelector("#loader").remove(),void console.log("harvest error, please check linking parameters.");if(document.querySelector("#loader").remove(),"DC"==r)for(let e in n){let t;r.includes("DC")?t="#dc-"+e:r.includes("EAD")&&(t="#isadg-"+e),Array.isArray(n[e])?(document.querySelector(t).value=n[e].join(", "),console.log(t.replace("#","")),dcVals[t.replace("#","")]=n[e].join(", ")):(document.querySelector(t).value=n[e],console.log(t.replace("#","")),dcVals[t.replace("#","")]=n[e])}else r.includes("ead");!function(e){let t=document.querySelector("#curateMdPanel").lastChild;if(!t.innerHTML.includes("unsaved changes")){const e=document.createElement("span");e.textContent="You have unsaved changes!",t.prepend(e)}}()};function r(r){if("curateMdPanel"==r.id||0==pydio._dataModel._selectedNodes.length)return;const n=r.querySelector(".panelContent"),i=n.firstChild,s=n.firstChild.cloneNode(!0),l=Array.from(i.childNodes),d=Array.from(s.childNodes),c=(document.querySelector("#sidecarFileTemplate").content.cloneNode(!0),document.querySelector("#curateMetadataPanel").content.cloneNode(!0)),u=c.querySelector("#dcSection"),m=c.querySelector("#isadSection"),p=c.querySelector("#importSection"),h=c.querySelector("#exportSection"),f=c.querySelector("#tagsSection");l.length;for(let t=0;t<d.length;t++){var y=l[t];if(!y.querySelector("label")){y.remove();continue}const o=y.querySelector("label").textContent.toLowerCase();if(o.includes("dc-"))y.className="dropdown-item",u.querySelector(".metadataPanel-accordion-content").appendChild(y);else if(o.includes("isad(g)-")){var g=(b=o,w=e,w[b]||"Unknown").replaceAll(" ","");y.className="dropdown-item",m.querySelector("#isad"+g).querySelector(".metadataPanel-accordion-content").appendChild(y)}else o.includes("import-")?(y.className="dropdown-item",p.querySelector(".metadataPanel-accordion-content").appendChild(y)):o.includes("export-")?(y.className="dropdown-item",h.querySelector(".metadataPanel-accordion-content").appendChild(y)):o.includes("tags")?f.querySelector(".metadataPanel-accordion-content").appendChild(y):o.includes("enable-inheritence")&&pydio._dataModel._bDir?r.querySelector(".panelContent").before(y):y.remove()}var b,w;const v=document.createElement("button");v.id="harvestBtn",v.innerHTML='<i class="icon-link menu-icons" style="color:gray;margin-left:0 !important";></i>',v.className="harvestBtn",v.addEventListener("click",o);let C=document.createElement("text");C.textContent="Harvest from OAI link ID",C.className="cwT",v.append(C);let E=document.createElement("div");E.append(v),p.querySelector(".metadataPanel-accordion-content").appendChild(E),1==r.parentElement.childElementCount&&(c.querySelector(".metadataPanel-accordion").style.overflowY="auto",c.querySelector(".metadataPanel-accordion").style.maxHeight="50em"),r.id="curateMdPanel",n.removeChild(n.firstChild),n.appendChild(c),t(),a(r)}const a=e=>{if(e||(e=document.querySelector("#curateMdPanel")),"DIV"==e.tagName)var t=e;else t=document;if(0!=pydio._dataModel._selectedNodes.length&&t.querySelector(".sidecar-list")){{if(Array.from(t.querySelector(".sidecar-list").children).forEach((e=>{e.remove()})),!Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"])return void(t.querySelector("#sidecarArea")&&(t.querySelector("#sidecarArea").style.display="none"));if(0==Object.keys(Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"]).length&&t.querySelector("#sidecarArea"))return void(t.querySelector("#sidecarArea").style.display="none");t.querySelector("#sidecarArea").style.display="block";let e=Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"].files;if(!e)return;if(0==e.length)return;e.forEach((e=>{var o=e.length>15?e.split(":")[1].substring(0,15).trim()+"...":e,r=document.querySelector("#sidecarFileTemplate").content.cloneNode(!0);r.addEventListener("click",(e=>{})),r.querySelector("#sidecarLabel").textContent=o,r.querySelector("#sidecarLabel").title=e,t.querySelector(".sidecar-list").appendChild(r)}))}if(t.querySelector(".sidecar-list").parentElement.classList.contains("expanded")){let e=t.querySelector(".sidecar-list").parentElement;e.style.maxHeight=1.1*e.scrollHeight+"px";let o=e.parentElement.parentElement;adjustMainContentHeight(o,e.scrollHeight)}}},n=(e,t)=>{for(let t of e)"childList"===t.type&&t.addedNodes.forEach((e=>{"DIV"===e.tagName&&(e.querySelector('[title="OtherMeta"]')&&(document.querySelector('[title="OtherMeta"]').parentElement.style.display="none"),e.querySelector("#workspace_toolbar")&&(pydio.UI.themeBuilder.dark?document.querySelector("#workspace_toolbar").parentElement.style.background="rgb(32, 37, 41)":document.querySelector("#workspace_toolbar").parentElement.style.background="linear-gradient(90deg, var(--customerColourPrimary), var(--customerColourHighlight))"))}))};window.addEventListener("load",(e=>{const o=new MutationObserver((function(e){((e,t)=>{var o=!1;e.forEach((e=>{0!=Object.keys(e.addedNodes).length&&"panelCard"===e.addedNodes[0].className&&(o=!0)})),0!=o&&document.querySelectorAll(".panelCard").forEach((e=>{if(e.innerText.includes("Meta Data")&&!e.id){const t=e;if(t.id=null,t.firstChild.addEventListener("click",(e=>{if(t.querySelector(".panelContent"))t.id=null;else{const e=setInterval((()=>{t.querySelector(".panelContent")&&(clearInterval(e),r(t))}),10)}})),t.querySelector(".panelContent")&&"curateMdPanel"!==t.id){const e=t.querySelector(".panelContent").firstChild;if(!e.children)return;const o=setInterval((()=>{e.children.length>2&&(clearInterval(o),r(t),t.id="curateMdPanel")}),50)}}}))})(e)}));o.observe(document.body,{subtree:!0,childList:!0}),new MutationObserver(n).observe(document.body,{childList:!0,subtree:!0}),document.addEventListener("click",(e=>{let o=e.target.closest(".mdi");if(!o)return;if(!o.classList.contains("mdi-theme-light-dark"))return;const r=pydio.UI.themeBuilder.dark,a=setInterval((()=>{pydio.UI.themeBuilder.dark!==r&&(t(),clearInterval(a))}),100)}));const i=setInterval((()=>{pydio&&(clearInterval(i),pydio._dataModel.observe("selection_changed",a))}),50)}))},310:()=>{async function e(e,o,r){return await t(e,o,r)}async function t(e,o,r,a=0){const n=o.lastIndexOf("."),i=-1!==n?o.slice(0,n):o,s=-1!==n?o.slice(n):"",l=0===a?o:`${i}-${a}${s}`,d=await fetch(window.location.origin+"/a/tree/stats",{method:"POST",headers:{...r,authorization:"Bearer "+e},body:JSON.stringify({NodePaths:[l]})});if(d.ok){const n=(await d.json()).Nodes;return n&&n.length>0?t(e,o,r,a+1):l}return console.error("Error checking pathname"),null}function o(e,t){let o;o=e.NodeId?window.location.origin+"/a/scheduler/hooks/notifynode":window.location.origin+"/a/scheduler/hooks/notify";const r={method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({JobParameters:e})};fetch(o,r).then((e=>e.text())).then((e=>console.log(e))).catch((e=>console.error("error",e)))}function r(e,t){return PydioApi._PydioRestClient.getOrUpdateJwt().then((e=>{let o=window.location.origin+"/a/tree/stats";return fetch(o,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:t})}))}function a(e,t,o){const r=[];for(const o of e){const e=o.filename.replace(/^objects\//,"");for(const a of t)if(a.Path===e){o.filename=a.Uuid,r.push(o);break}}return r}function n(e){const t=[];return e.forEach((e=>{const o=e.filename;delete e.filename,Object.entries(e).forEach((([e,r])=>{t.push({NodeUuid:o,Namespace:`usermeta-${e.replace(".","-")}`,JsonValue:JSON.stringify(r)})}))})),{MetaDatas:t,Operation:"PUT"}}function i(e,t,i,s,l,d){var c;try{c=JSON.parse(e.target.result)}catch(e){return console.error("Parsing Error: ",e),void o({Title:"Metadata Parsing Error",Text:"Metadata import failed because your import JSON failed to parse correctly.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t},s)}if(d)r(0,JSON.stringify({NodePaths:c.map((e=>e.filename.replace("objects/","")))})).then((e=>{200!==e.status?(console.log("Metadata Update Error"),o({Title:"Metadata Update Error",Text:"Metadata import failed because there was an error finding your import objects.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t},s)):e.json().then((e=>{if(0==Object.keys(e).length)console.log("No Associations Found"),o({Title:"No Associations Found",Text:"No associations were found in your import document.",UserId:t},s);else{var r;try{console.log("assssss: ",e),r=a(c,e.Nodes)}catch(e){return console.error("Association Error: ",e),void o({Title:"Metadata Association Error",Text:"Metadata import failed because there was an eror associating your metadata to its objects.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t},s)}if(0==r.length)return console.log("No Associations Found"),void o({Title:"No Associations Found",Text:"No associations were found in your import document.",UserId:t},s);const i=n(r),l=window.location.origin+"/a/user-meta/update";fetch(l,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify(i)}).then((e=>{if(200!==e.status)return console.error("Metadata Update Error"),void o({Title:"Metadata Update Error",Text:"Metadata import failed because there was an error updating your metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t},s);e.json().then((e=>{console.log("Metadata import detail: ",e),o({Title:"Metadata Import Successful",Text:"Metadata import was successful.</br></br>**Update Detail**</br>Updated "+e.MetaDatas.length+" metadata fields",UserId:t},s)}))})).catch((e=>{console.error("Metadata Update Error: ",e),o({Title:"Metadata Update Error",Text:"Metadata import failed because there was an eror updating your objects metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t},s)}))}}))}));else{var u;try{u=a(c,l.Nodes)}catch(e){return console.log("Association Error: ",e),void o({Title:"Metadata Association Error",Text:"Metadata import for [Object] failed because there was an eror associating your metadata to its objects.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t,NodeId:i},s)}if(0==u.length)return console.log("No Associations Found"),void o({Title:"No Associations Found",Text:"Metadata import for [Object] was successful, but no associations were found in your import document.",UserId:t,NodeId:i},s);const e=n(u),r=window.location.origin+"/a/user-meta/update";fetch(r,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify(e)}).then((e=>{if(200!==e.status)return console.log("Metadata Update Error"),void o({Title:"Metadata Update Error",Text:"Metadata import for [Object] failed because there was an error updating your uploaded objects metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+e,UserId:t,NodeId:i},s);e.json().then((e=>{console.log("Metadata import detail: ",e),o({Title:"Metadata Import Successful",Text:"Metadata import for [Object] was successful.</br></br>**Update Detail**</br>Updated "+e.MetaDatas.length+" metadata fields",UserId:t,NodeId:i},s)}))})).catch((e=>{console.error(e),console.log("Metadata Update Error: ",err),o({Title:"Metadata Update Error",Text:"Metadata import for [Object] failed because there was an eror updating your uploaded objects metadata.</br>Please review the error message for further details.</br></br>**Error Content**</br>"+err,UserId:t,NodeId:i},s)}))}}function s(e,t,o,a,n,l){(e+=1)!==2*t?pydio.observeOnce("longtask_finished",(()=>{s(e,t,o,a,n)})):setTimeout((()=>{d(n),1==o.length&&"metadata.json"!==o[0].name||a&&function(e,t,o,a){pydio.user.getIdmUser().then((e=>e.Uuid)).then((e=>{const t=PydioApi._PydioRestClient.authentications.oauth2.accessToken;if("userfile"==a){for(const r in o)if("metadata.json"==o[r].name){let a=new FileReader;return a.addEventListener("load",(o=>i(o,e,null,t,null,!0))),void a.readAsText(o[r])}}else"userfolder"==a&&r(0,JSON.stringify({NodePaths:[`${Curate.workspaces.getOpenWorkspace()}/${o[0].webkitRelativePath.split("/")[0]}`]})).then((e=>e.json())).then((e=>e.Nodes[0].Uuid)).then((a=>{r(0,function(e){const t={NodePaths:Object.values(e).map((e=>`${Curate.workspaces.getOpenWorkspace()}/${e.webkitRelativePath}`))};return JSON.stringify(t)}(o)).then((e=>e.json())).then((r=>{for(const n in o)if("metadata.json"==o[n].name){let s=new FileReader;s.addEventListener("load",(o=>i(o,e,a,t,r))),s.readAsText(o[n])}}))}))}))}(0,0,o,a)}),10*t)}function l(e,t,o){pydio.user.getIdmUser().then((e=>e.Uuid)).then((e=>PydioApi._PydioRestClient.authentications.oauth2.accessToken)).then((r=>{const a=window.location.origin+"/a/user-meta/update",n=`Bearer ${r}`,i={MetaDatas:[{NodeUuid:e,Namespace:t,JsonValue:JSON.stringify(o),Policies:[{Action:"READ",Effect:"allow",Subject:"*"},{Action:"WRITE",Effect:"allow",Subject:"*"}]}],Operation:"PUT"};fetch(a,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:n},body:JSON.stringify(i)}).then((e=>{200===e.status||console.error("Update Error")})).catch((e=>{console.error("Update Error: ",e)}))}))}function d(e){pydio.user.getIdmUser().then((e=>e.Uuid)).then((e=>PydioApi._PydioRestClient.authentications.oauth2.accessToken)).then((t=>{var a=pydio.user.idmUser.Uuid;const n={NodePaths:e.map((e=>e.relativePath))};r(0,JSON.stringify(n)).then((e=>e.json())).then((r=>{const n=function(e,t){const o=[],r=[];return e.Nodes.forEach((e=>{const a=t.find((t=>t.name.toLowerCase()===JSON.parse(e.MetaStore.name.toLowerCase())));a&&a.hash===e.Etag?(o.push({Uuid:e.Uuid,Name:JSON.parse(e.MetaStore.name),Path:e.Path,Etag:e.Etag,Hash:a.hash}),l(e.Uuid,"usermeta-file-integrity","✓ Integrity verified")):a&&(r.push({Uuid:e.Uuid,Name:JSON.parse(e.MetaStore.name),Path:e.Path,Etag:e.Etag,Hash:a.hash}),l(e.Uuid,"usermeta-file-integrity","X Integrity compromised"))})),{matches:o,fails:r}}(r,e);document.querySelector(".transparent-dropzone")&&u(n),new MutationObserver((e=>{for(const t of e)t.addedNodes&&t.addedNodes.forEach((e=>{e.children&&Array.from(e.children).forEach((e=>{e.classList.contains("transparent-dropzone")&&u(n)}))}))})).observe(document.body,{childList:!0,subtree:!0}),console.log("Checksums: ",e),0==n.fails.length&&n.matches.length==e.length?(console.log("Checksum report, no errors: ",n.matches.length," files were successfully verified, no issues were found. Please review the output object for more detail: ",n),o({Title:"Checksum Report",Text:n.matches.length+" Files were successfully verified. No issues were found.",UserId:a},t)):0==n.fails.length&&n.matches.length!==e.length?(console.log("Checksumming error, could not generate checksums for all files"),o({Title:"Checksum Report",Text:"Checksumming error, could not generate checksums for all files.</br>Please review the developer console for further details.",UserId:a},t)):0!==n.fails.length&&(console.log("Checksum report, issues found: ",n.fails.length," files had inconsistent checksums. Check the output object for more detail: ",n.fails),o({Title:"Checksum Report",Text:n.fails.length+" files had inconsistent checksums. Please review the developer console for further details.",UserId:a},t))}))}))}const c=e=>{};function u(e,t,o){var r=Array.from(document.querySelectorAll(".upload-loaded"));e.matches.forEach((e=>{e.Path.split("/").slice(1).forEach((e=>{const t=r.find((t=>t.textContent.includes(e)));if(!t)return;const o=Array.from(t.querySelectorAll("div")).find((t=>t.textContent.includes(e)));if(!o.querySelector(".mdi-folder")&&!o.textContent.includes("File verified")){const t=m(!0);Array.from(o.querySelectorAll("div")).find((t=>t.textContent.trim()==e)).after(t)}}))})),e.fails.forEach((e=>{setTimeout((t=>{e.Path.split("/").slice(1).forEach((e=>{const t=r.find((t=>t.textContent.includes(e)));if(!t)return;const o=Array.from(t.querySelectorAll("div")).find((t=>t.textContent.includes(e)));if(o.querySelector(".mdi-folder")&&!o.hasAttribute("listening"))return o.setAttribute("listening",!0),void o.addEventListener("click",c);if(!o.querySelector(".mdi-folder")&&!o.textContent.includes("File compromised")){const t=m(!1);Array.from(o.querySelectorAll("div")).find((t=>t.textContent.trim()==e)).after(t)}}))}),200)}));let a=document.querySelector(".transparent-dropzone");p||(a.addEventListener("click",(t=>{if(console.log("click handling: ",t),t.target.closest(".upload-loaded")&&t.target.closest(".upload-loaded").querySelector(".mdi-folder")){if(t.target.closest(".upload-loaded").querySelector(".mdi-chevron-down"))return;console.log("open folder"),setTimeout((function(){u(e)}),150)}t.target.classList.contains("mdi-close-circle-outline")&&(console.log("closing one"),setTimeout((function(){u(e)}),150)),t.target.closest("mdi")&&t.target.closest("mdi").classList.contains("mdi-plus-box-outline")&&(console.log("load more"),setTimeout((function(){u(e)}),150))})),p=!0)}function m(e){const t=document.createElement("div");return t.style="padding-left:0.3em;padding-right:0.4em;max-width:1.5em;max-height:1.7em;border:gray solid 1px;border-radius:5em;display:inline-flex;font-size:9pt;transition: ease all 0.3s;overflow:hidden;",e?(t.style.color="green",t.textContent="✓ File verified",t.title="File successfully verified."):(t.style.color="red",t.textContent="X  File compromised",t.title="File compromised. Please reupload.",t.style.paddingLeft="0.35em !important"),t.addEventListener("mouseover",(e=>{e.target.style.backgroundColor="#e2e2e2",e.target.style.maxWidth="10.5em"})),t.addEventListener("mouseleave",(e=>{e.target.style.backgroundColor="white",e.target.style.maxWidth="1.5em"})),t}var p=!1;async function h(t,o){if(t.isDirectory){var r=t.createReader(),a=await new Promise((e=>r.readEntries(e)));await Promise.all(a.map((e=>h(e,o))))}else{var n=await new Promise((e=>t.file(e)));try{var i=await function(t){return new Promise(((o,r)=>{if("undefined"!=typeof Worker){(a=document.querySelector("#hashWorker").src,fetch(a).then((e=>{if(!e.ok)throw new Error("Network response was not ok");return e.text()})).catch((e=>{console.error("There was a problem fetching the script:",e)}))).then((a=>{if(a){var n=new Blob([a],{type:"application/javascript"}),i=window.URL.createObjectURL(n),s=new Worker(i);PydioApi._PydioRestClient.getAuthToken().then((a=>{const n=Curate.workspaces.getOpenWorkspace()+("/"!==pydio._dataModel._currentRep?pydio._dataModel._currentRep+"/":""),i=t.webkitRelativePath?"/"+t.webkitRelativePath:"";e(a,n+i+(i?"":"/"+t.name),{"content-type":"application/json","accept-encoding":"gzip"}).then((e=>{console.log("[Main]","Init Web Worker"),s.onmessage=function(r){if("complete"===r.data.status){const a=e.substring(e.lastIndexOf("/")+1);console.log("hash is: ",r.data.hash),o({file:t,hash:r.data.hash,name:a,relativePath:e})}},s.postMessage({file:t,msg:"begin hash"})})).catch((e=>{console.error("Error:",e),r(e)}))})).catch((e=>{console.error("Error:",e),r(e)}))}else console.error("Empty script content received.")})).catch((e=>{console.error("Error while fetching script content:",e)}));const n=new Blob([document.querySelector("#hashWorker").textContent]),i=window.URL.createObjectURL(n);new Worker(i)}else console.log("Browser does not support web-workers. Please update."),r("Web workers not supported.");var a}))}(n);o.push(i)}catch(e){console.error("Error:",e)}}}document.addEventListener("input",(function(e){let t=e.target;if("userfile"===t.name||"userfolder"===t.name){const e=uploadChecksumHandler(t.files),o={...t.files};let r=t.files.length,a=0;pydio.observeOnce("longtask_finished",(()=>{s(a,r,o,t.name,e)}))}})),document.addEventListener("drop",(async function(e){if(e.dataTransfer&&"drop-zone dropzone-hover"!==e.target.className){var t=e.dataTransfer;let r=[...t.files];var o=await async function(e){for(var t=[],o=e.items.length,r=[],a=0;a<o;a++)r.push(e.items[a]);return await Promise.all(r.map((e=>h(e.webkitGetAsEntry(),t)))),t}(t);let a=r.length;r.forEach((e=>{pydio.observeOnce("longtask_finished",(()=>{a--,0===a&&setTimeout((()=>{console.log("All tasks finished"),d(o)}),100*r.length)}))}))}}))},678:()=>{function e(e){var t=function(){try{return Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).files[0].matches[0].id}catch(e){return"File has not been characterised"}}(),o=function(){let e=[Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["usermeta-virus-scan-first"],Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata)["usermeta-virus-scan-second"]];return null!=e[0]&&""!=e[0]||(e[0]="File has not been scanned"),null!=e[1]&&""!=e[1]||(e[1]="File has not been scanned"),e}(),r=o[0],a=o[1],n=(function(){try{return Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).etag}catch(e){return"Checksum could not be located"}}(),function(){try{let e=Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).mimestring;if(null==e)try{let e=Object.fromEntries(window.pydio._dataModel._selectedNodes[0]._metadata).mime;return null==e?"Unidentified":e}catch(e){return"NA"}return e}catch(e){return"NA"}}()),i=function(e,t){var o="Risk";return"File has not been scanned"==e&&(o="Risk"),e.toLowerCase().includes("passed")&&"File has not been scanned"==t&&(o="Quarantined"),e.toLowerCase().includes("passed")&&"File has not been scanned"==t&&!Curate.workspaces.getOpenWorkspace().includes("quarantine")&&(o="Risk, second scan will not be completed."),e.toLowerCase().includes("passed")&&t.toLowerCase().includes("passed")&&(o="Released"),o}(r,a);setTimeout((function(){let o=document.createElement("div");o.style.marginTop="-11px",o.id="curateAdditionalInfo";let l=s("Pronom ID",t),d=s("First virus scan result",r),c=s("Second virus scan result",a),u=(s("Mimetype",n),s("Status",i));e.querySelector(".panelContent").childNodes.forEach((e=>{e.innerText.includes("ETag")&&(e.firstChild.innerText="Checksum")}));let m=document.createElement("HR"),p=document.createElement("div"),h=document.createElement("div");h.style.marginBottom="5px",p.textContent="Quarantine Info",p.id="quarantineInfoLabel",p.style.color="rgb(77, 122, 143)",p.style.fontSize="14px",p.style.fontWeight="500",p.style.marginLeft="15px",p.style.marginBottom="10px",o.appendChild(l),o.appendChild(m),o.appendChild(p),o.appendChild(u),o.appendChild(d),o.appendChild(c),o.appendChild(h),e.textContent.includes("Pronom")?(e.removeChild(e.lastChild),e.appendChild(o)):e.appendChild(o)}),5);const s=(e,t)=>{let o=document.createElement("div");o.class="infoPanelRow",o.style.padding="0px 16px 6px";let r=document.createElement("div");r.class="infoPanelLabel",r.style.fontWeight="415",r.textContent=e;let a=document.createElement("div");return a.class="infoPanelValue",a.textContent=t,o.appendChild(r),o.appendChild(a),o}}const t=(t,r)=>{r=Array.from(document.querySelectorAll(".panelCard")).find((e=>e.textContent.includes("File Info"))),t.memo._selectedNodes&&0!=t.memo._selectedNodes.length&&t.memo._selectedNodes[0]!=o&&r.querySelector(".panelContent")&&(e(r),o=t.memo._selectedNodes[0])};var o;new MutationObserver(((o,r)=>{for(const r of o)if("childList"===r.type)for(const o of r.addedNodes)if(o instanceof HTMLElement&&o.classList.contains("panelCard")&&o.innerText.includes("File Info")){const r=o;return pydio._dataModel._observers.selection_changed.includes(t)||pydio._dataModel.observe("selection_changed",(e=>{t(e)})),r.firstElementChild.addEventListener("click",(t=>{r.querySelector(".mdi").classList.contains("mdi-chevron-up")?r.querySelector("#curateAdditionalInfo").remove():r.querySelector(".mdi").classList.contains("mdi-chevron-down")&&e(r)})),void(o.querySelector(".panelContent")&&e(o))}})).observe(document.documentElement,{childList:!0,subtree:!0})},203:()=>{importScripts("https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"),self.onmessage=async function(e){if(e.data.file&&"begin hash"==e.data.msg){const o=await(t=e.data.file,new Promise(((e,o)=>{var r=0,a=(performance.now(),t.size);const n=new FileReader,i=new SparkMD5.ArrayBuffer,s=2097152,l=Math.ceil(t.size/s);let d=0;n.onload=t=>{i.append(t.target.result),++d,d<l?c():e(i.end())},n.addEventListener("progress",(e=>{r+=e.loaded,Math.round(r/a*100)})),n.addEventListener("loadend",(e=>{e.total>0&&performance.now()})),n.onerror=()=>o(n.error);const c=()=>{const e=d*s,o=e+s>=t.size?t.size:e+s;n.readAsArrayBuffer(File.prototype.slice.call(t,e,o))};c()})));postMessage({status:"complete",hash:o}),self.close()}var t}},887:()=>{function e(e){let t=document.createElement("div"),o=document.createElement("button"),r=document.createElement("span"),a=document.createElement("text"),n=document.createElement("hr");a.textContent=e,a.style.marginTop="1em",r.style.ariaHidden="true",r.innerHTML="&times;",o.style.ariaLabel="Close alert",o.style.type="button",o.style.backgroundColor="white",o.style.border="0",o.style.position="absolute",o.style.top="0",o.style.right="0",o.onclick=function(){this.parentNode.className="slideOut",setTimeout((function(){t.remove()}),1e3)},o.appendChild(r),t.style.backgroundColor="white",t.style.borderRadius="0.5em",t.style.width="16em",t.style.height="auto",t.style.padding="1.8em",t.style.paddingBottom="0em",t.style.margin="2em",t.style.position="absolute",t.style.bottom="5em",t.style.right="0",t.style.boxShadow="0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)",t.className="slideIn",n.style.borderTop="1px solid black",n.style.marginTop="1em",n.className="lineLoad",o.appendChild(r),t.appendChild(o),t.appendChild(a),t.appendChild(n),document.querySelector("body").appendChild(t),setTimeout((function(){t.classList.remove("slideIn")}),1e3),setTimeout((function(){t.className="slideOut",setTimeout((function(){t.remove()}),1e3)}),6e3)}let t=e=>new Promise((t=>setTimeout(t,e)));function o(){setTimeout((function(){let e=["Generate mimetype report","Export Archivematica JSON"];for(let t=0;t<e.length;t++){let o="//div[text()='"+e[t]+"']";try{document.evaluate(o,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.parentElement.parentElement.parentElement.parentElement.remove()}catch(e){}}}),1)}document.addEventListener("DOMContentLoaded",(function(){let r;!async function(){let o=1;for(;0!==o;)if(await t(100),null==document.querySelector("#workspace_toolbar"));else if(o=0,window.location.href.includes("/public/"))if(null==document.querySelector("#pydio_shared_folder")){let t=document.querySelector("#pydio_dropbox_template").firstElementChild.firstElementChild;t.style.backgroundColor="#9fd0c7";let o=t.firstElementChild;o.style.marginTop="1em",o.style.marginBottom="1em",o.style.marginLeft="1em";let r=document.querySelector(".segment");r.textContent="Directory: "+r.textContent,e("Welcome to Curate, simply drag and drop files in to the dashed area to upload.")}else{let t=document.querySelector("#pydio_shared_folder").firstElementChild.firstElementChild;t.style.backgroundColor="#9fd0c7";let o=t.firstElementChild;o.style.marginTop="1em",o.style.marginBottom="1em",o.style.marginLeft="1em";let a="Welcome to Curate, here you can view or download files shared with you by your collaborators.";if(0==pydio.Controller.actions.toJSON()[8][1].deny)var r=a+" You can also create folders and upload new files.";else r=a;e(r)}}();try{r=document.querySelector("#pydio_shared_folder")}catch(e){}r&&setTimeout((function(){document.querySelector(".toolbars-button-menu").addEventListener("click",o)}),3e3)}))},578:()=>{window.addEventListener("load",(function(){var t=Object.fromEntries(pydioBootstrap.parameters).i18nMessages;Object.entries(e).forEach((function(e){t[e[0]]=e[1]}))}));var e={"ajax_gui.tour.welcomemodal.title":"Welcome to Curate","ajax_gui.tour.welcomemodal.subtitle":"Drag'n'drop a photo of you for your profile! This quick tour will guide you through the web interface.","ajax_gui.tour.welcomemodal.start":"Start the tour","ajax_gui.tour.workspaces.1":"Workspaces are top-level folders that help you manage your archiving workflow and organise your data. The Personal Files workspace can only be accessed by you and the Quarantine, Appraisal and Archive workspaces are shared with your workgroup. The Package Templates workspace is common to all accounts and is read only.","ajax_gui.tour.workspaces.2":"You can upload into the Personal Files and Quarantine workspaces, move files to Appraisal to work on them and deposit packages in the Archive when you are finished.","ajax_gui.tour.globsearch.title":"Global Search","ajax_gui.tour.globsearch.1":"Use this search form to find files or folders in any workspace. Only the first 5 results are shown, enter a workspace to get more results, and more search options. Tip: you can use an asterisk as a wild card.","ajax_gui.tour.globsearch.2":"When no search is entered, the history of your recently accessed files and folder is displayed instead.","ajax_gui.tour.openworkspace.title":"Open a workspace","ajax_gui.tour.openworkspace":"At the first connection, your history is probably empty. Enter the Personal or Quarantine workspaces to start adding files. Tip: files are virus checked when they are uploaded and should be kept in Quarantine for 30 days, after which they are scanned again.","ajax_gui.tour.create-menu.title":"Add files","ajax_gui.tour.create-menu":"Start adding new files or folders to the current workspace.","ajax_gui.tour.display-bar.title":"Display Options","ajax_gui.tour.display-bar":"This toolbar allows you to change the display: switch to thumbnails or detail mode depending on your usage, and sort files by name, date, etc...","ajax_gui.tour.infopanel.title":"Info Panel","ajax_gui.tour.infopanel.1":"Here, you will find a preview and comprehensive information about your current selection: file information, virus scan status, metadata, etc.","ajax_gui.tour.infopanel.2":"You can close this panel by using the info button in the display toolbar","ajax_gui.tour.uwidget.title":"User Settings","ajax_gui.tour.uwidget.addressbook":"Directory of all the users accessing to the platform. Create your own users, and constitute teams that can be used to share resources","ajax_gui.tour.uwidget.alerts":"Alerts panel will inform you when a user with whom you shared some resources did access it. They can be sent to you directly by email.","ajax_gui.tour.uwidget.menu":"Access to other options : manage your profile and password, view all of the public links you have created, send a support message, configure the Archivematica Connector and sign out of the platform.","ajax_gui.tour.uwidget.home":"Go back to the welcome panel with this button"}}},t={};function o(r){var a=t[r];if(void 0!==a)return a.exports;var n=t[r]={exports:{}};return e[r](n,n.exports,o),n.exports}o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";o(886),o(748),o(678),o(203),o(887),o(578),o(310)})()})();