const permissionHandlers = {
    upload:{
        enforceWorkspaceUpload:{
            event: "drop",
            target: document,
            description: "enforce workspace upload permissions for standard users",
            handler: (e)=>{
                if (!['quarantine', 'personal-files', 'common files'].includes(Curate.workspaces.getOpenWorkspace()) && pydio.user.idmUser.Roles.find(r=>r.Label = "Standard User")){
                    e.stopImmediatePropagation()
                    Curate.ui.modals.curatePopup({"title": "You do not have permission to upload to this workspace"},{"afterLoaded":(container)=>{
                        const content = document.createElement("div");
                        content.innerHTML = `<div class="config-modal-content">
                            <div class="config-popup-title">
                                <p>Please upload your content to the Quarantine workspace instead.</p>
                            </div>
                        </div>`;
                        
                        container.querySelector(".config-main-options-container").appendChild(content);
                    }}).fire() 
                }
            }
        }  
    }
}

//main, onload attach all permission enforcing event handlers described above.
window.addEventListener("load",e=>{
    attachAllEventHandlers(permissionHandlers)
})

//functions
function attachAllEventHandlers(permissionEvents) {
    Object.entries(permissionEvents).forEach(([category, events]) => {
        Object.entries(events).forEach(([eventName, {event, target, handler}]) => {
            try{
                target.addEventListener(event, handler);
            }catch(err){
                console.error("could not attach: ", permissionEvents[category][eventName])
            }   
        });
    });
}