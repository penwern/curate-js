 const isadFieldToAreaMapping = {
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
    function darkModeModify() {
        if (pydio.UI.themeBuilder.dark) {
            var bgc = "#465957"
            var icc = "#314243"
            var ddc = "#474747"
            var itc = "linear-gradient(#474747, #474747) padding-box, linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box"
            var dzc = "#5c5a5a"
            var hc = "#202529"
        } else {
            var bgc = "#f6f6f6"
            var icc = "#EFEEEE"
            var ddc = "white"
            var itc = "linear-gradient(white, white) padding-box, linear-gradient(to right, var(--customerColourPrimary), var(--customerColourHighlight)) border-box"
            var dzc = "#F5F5F5"
            var hc = "linear-gradient(90deg, var(--customerColourPrimary), var(--customerColourHighlight))"
        }
        const aHeaders = Array.from(document.querySelectorAll(".metadataPanel-accordion-header"))
        aHeaders.forEach(header => {
            header.style.backgroundColor = bgc
        })
        const aIcons = Array.from(document.querySelectorAll(".metadataPanel-accordion-icon"))
        aIcons.forEach(icon => {
            icon.style.backgroundColor = icc
        })
        const adItems = Array.from(document.querySelectorAll(".dropdown-item"))
        adItems.forEach(item => { item.style.backgroundColor = ddc })
        const aItems = Array.from(document.querySelectorAll(".metadataPanel-accordion-item"))
        aItems.forEach(item => { item.style.background = itc })
        const dropZones = Array.from(document.querySelectorAll(".drop-zone"))
        dropZones.forEach(zone => { zone.style.backgroundColor = dzc })
        if (document.querySelector("#workspace_toolbar")) {
            document.querySelector("#workspace_toolbar").parentElement.style.background = hc
        }
    }
    function inputHandler(ev) {
        let md = document.querySelector("#curateMdPanel")
        let x = md.lastChild
        if (x.innerHTML.includes("unsaved changes")) {
            return
        } else {
            const usc = document.createElement("span")
            usc.textContent = "You have unsaved changes!"
            x.prepend(usc)
        }
    }

    const harvestOaiHandler = async () => {
        const loader = document.createElement("i")
        loader.className = "fa fa-circle-o-notch fa-spin"
        loader.id = "loader"
        harvestBtn.prepend(loader)
        let linkId = document.querySelector("#import-oai-link-id").value
        let harvestRepo = document.querySelector("#import-oai-repo-url").value
        let pfix = document.querySelector("#import-oai-metadata-prefix").value
        //set harvest params 
        const harvest = {
            baseUrl: harvestRepo,
            verb: 'GetRecord',
            identifier: linkId,
            metadataPrefix: pfix,
            oaiVersion: 1,
        }
        //perform the operation
        const metadata = await harvestOAI(harvest);
        console.log(metadata)
        if (!metadata) {
            document.querySelector("#loader").remove()
            console.log("harvest error, please check linking parameters.")
            return
        }
        document.querySelector("#loader").remove()
        if (pfix == "DC") {
            for (let metaField in metadata) {
                let fieldId
                if (pfix.includes("DC")) {
                    fieldId = "#dc-" + metaField
                }
                else if (pfix.includes("EAD")) {
                    fieldId = "#isadg-" + metaField
                }

                if (Array.isArray(metadata[metaField])) {
                    document.querySelector(fieldId).value = metadata[metaField].join(", ")
                    console.log(fieldId.replace("#", ""))
                    dcVals[fieldId.replace("#", "")] = metadata[metaField].join(", ")
                } else {
                    document.querySelector(fieldId).value = metadata[metaField]
                    console.log(fieldId.replace("#", ""))
                    dcVals[fieldId.replace("#", "")] = metadata[metaField]
                }
            }
        }
        else if (pfix.includes("ead")) {
            //TODO add field updates for returned ISAD json
        }
        inputHandler()
    }

    function clearMetadata() {
        if (!document.querySelector("#curateMdPanel")) {
            return
        }
        const md = document.querySelector("#curateMdPanel")
        const fields = Array.from(md.getElementsByTagName("input"))
        fields.forEach(field => {
            field.value = ""
        })
    }
    function modifyMetadataPanel(metadataPanel) {
        if (metadataPanel.id == "curateMdPanel" || pydio._dataModel._selectedNodes.length == 0) {
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

        for (let x = 0; x < metadataFieldsClone.length; x++) {
            var field = metadataFields[x]
            const fieldName = field.textContent.toLowerCase()


            if (fieldName.includes("dc-")) {
                field.className = "dropdown-item"
                dcSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
            } else if (fieldName.includes("isad(g)-")) {
                var areaName = groupFieldsByArea(fieldName, isadFieldToAreaMapping).replaceAll(" ", "")
                field.className = "dropdown-item"
                isadSection.querySelector("#isad" + areaName).querySelector(".metadataPanel-accordion-content").appendChild(field)
            } else if (fieldName.includes("import-")) {
                field.className = "dropdown-item"
                importSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
            } else if (fieldName.includes("export-")) {
                field.className = "dropdown-item"
                exportSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
            } else if (fieldName.includes("tags")) {
                tagsSection.querySelector(".metadataPanel-accordion-content").appendChild(field)
            } else if (fieldName.includes("enable-inheritence") && pydio._dataModel._bDir) {
                metadataPanel.querySelector(".panelContent").before(field)
                console.log(field)
            } else {
                field.remove()
            }
        }
        //create OAI harvest button
        const harvestBtn = document.createElement("button")
        harvestBtn.id = "harvestBtn"
        harvestBtn.innerHTML = '<i class="icon-link menu-icons" style="color:gray;margin-left:0 !important";></i>'
        harvestBtn.className = "harvestBtn"
        harvestBtn.addEventListener("click", harvestOaiHandler)
        let harvestBtnText = document.createElement("text")
        harvestBtnText.textContent = "Harvest from OAI link ID"
        harvestBtnText.className = "cwT"
        harvestBtn.append(harvestBtnText)
        let harvestBtnDiv = document.createElement("div")
        harvestBtnDiv.append(harvestBtn)
        importSection.querySelector(".metadataPanel-accordion-content").appendChild(harvestBtnDiv)
        if (metadataPanel.parentElement.childElementCount == 1) {
            metadataPanelTemplate.querySelector(".metadataPanel-accordion").style.overflowY = "auto"
            metadataPanelTemplate.querySelector(".metadataPanel-accordion").style.maxHeight = "50em"
        }
        metadataPanel.id = "curateMdPanel"
        panelContentParent.removeChild(panelContentParent.firstChild)
        panelContentParent.appendChild(metadataPanelTemplate)
        //if (!metadataPanel.id){
        //metadataPanel.addEventListener("click", function(){this.id=null})
        //}


        darkModeModify()

        retrieveSidecarInfo(metadataPanel)

    }
    const metadataPanelCallback = (e, metadataObserver) => {

        var p = false

        e.forEach(m => {
            if (Object.keys(m.addedNodes).length == 0) {
                return
            }
            if (m.addedNodes[0].className !== "panelCard") {
                return
            }
            p = true
        })
        if (p == false) {
            return
        }
        const panels = document.querySelectorAll('.panelCard');
        panels.forEach(panel => {
            if (panel.innerText.includes("Meta Data") && !panel.id) {
                const metadataPanel = panel
                metadataPanel.id = null
                metadataPanel.firstChild.addEventListener("click", e => {
                    if (metadataPanel.querySelector(".panelContent")) {
                        metadataPanel.id = null
                    } else {
                        const collapseInterval = setInterval(() => {
                            if (metadataPanel.querySelector(".panelContent")) {
                                clearInterval(collapseInterval)
                                modifyMetadataPanel(metadataPanel)
                            }
                        }, 10)

                    }
                })
                if (metadataPanel.querySelector(".panelContent") && metadataPanel.id !== "curateMdPanel") {
                    const panelContent = metadataPanel.querySelector(".panelContent").firstChild
                    if (!panelContent.children) {
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
    const retrieveSidecarInfo = (metadataPanel) => {
        if (!metadataPanel) {
            metadataPanel = document.querySelector("#curateMdPanel")
        }
        if (metadataPanel.tagName == "DIV") {

            var target = metadataPanel
        } else {
            var target = document
        }
        if (pydio._dataModel._selectedNodes.length == 0) {
            return
        }
        if (!target.querySelector(".sidecar-list")) {
            return
        }
        else {
            Array.from(target.querySelector(".sidecar-list").children).forEach(c => {
                c.remove()
            })
            if (!Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"]) {
                if (target.querySelector("#sidecarArea")) {
                    target.querySelector("#sidecarArea").style.display = "none"
                }
                return
            }
            if (Object.keys(Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"]).length == 0 && target.querySelector("#sidecarArea")) {
                target.querySelector("#sidecarArea").style.display = "none"
                return
            }
            target.querySelector("#sidecarArea").style.display = "block"
            let scs = Object.fromEntries(pydio._dataModel._selectedNodes[0]._metadata)["usermeta-sidecar-files"].files
            if (!scs) {
                return
            }
            if (scs.length == 0) {
                return
            }
            scs.forEach(scf => {
                var scfs = scf.length > 15 ? scf.split(":")[1].substring(0, 15).trim() + "..." : scf;
                var scft = document.querySelector("#sidecarFileTemplate").content.cloneNode(true)
                scft.addEventListener("click", e => {
                    //get file and render in codemirror

                })
                scft.querySelector("#sidecarLabel").textContent = scfs
                scft.querySelector("#sidecarLabel").title = scf
                target.querySelector(".sidecar-list").appendChild(scft)
            })
        }
        if (target.querySelector(".sidecar-list").parentElement.classList.contains("expanded")) {
            let content = target.querySelector(".sidecar-list").parentElement
            content.style.maxHeight = content.scrollHeight * 1.1 + 'px';
            let p = content.parentElement.parentElement
            adjustMainContentHeight(p, content.scrollHeight);
        }

    }
    const wsCallback = (mutationsList, observerInstance) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Check if any added nodes have the title "OtherMeta"
                mutation.addedNodes.forEach((addedNode) => {
                    if (addedNode.tagName !== "DIV") {
                        return
                    }
                    if (addedNode.querySelector('[title="OtherMeta"]')) {
                        // Hide the parent element by setting its display property to "none"
                        document.querySelector('[title="OtherMeta"]').parentElement.style.display = "none"
                    }
                    if (addedNode.querySelector("#workspace_toolbar")) {
                        if (pydio.UI.themeBuilder.dark) {
                            document.querySelector("#workspace_toolbar").parentElement.style.background = "rgb(32, 37, 41)"
                        } else {
                            document.querySelector("#workspace_toolbar").parentElement.style.background = "linear-gradient(90deg, var(--customerColourPrimary), var(--customerColourHighlight))"
                        }
                    }
                });
            }
        }
    }
    window.addEventListener("load", l => {
        const metadataObserver = new MutationObserver(function (e) { metadataPanelCallback(e, metadataObserver) });
        metadataObserver.observe(document.body, { subtree: true, childList: true });
        // Create a new instance of the MutationObserver
        const wsObserver = new MutationObserver(wsCallback);
        wsObserver.observe(document.body, { childList: true, subtree: true });
        document.addEventListener("click", e => {
            let cM = e.target.closest(".mdi")
            if (!cM) {
                return
            }
            if (!cM.classList.contains("mdi-theme-light-dark")) {
                return
            }
            // Get the initial state of ui theme
            const themeState = pydio.UI.themeBuilder.dark;
            // Create a setInterval function that checks for the state flip
            const themeInterval = setInterval(() => {
                // Check if the state has flipped
                if (pydio.UI.themeBuilder.dark !== themeState) {
                    darkModeModify()
                    clearInterval(themeInterval);
                }
            }, 100);
        })
        const interval = setInterval(() => {
            if (pydio) {
                clearInterval(interval);
                pydio._dataModel.observe("selection_changed", retrieveSidecarInfo)

            }
        }, 50);

    })
