const p = Curate.ui.modals.curatePopup({"title": "Search for AtoM Descriptions"},{
    "afterLoaded":(c)=>{
        const t = document.createElement("atom-search-interface")
        c.querySelector(".config-main-options-container").appendChild(t)
    }
})
p.fire()