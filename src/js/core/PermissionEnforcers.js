const permissionHandlers = {
    upload:{
        enforceWorkspaceUpload:{
            event: "drop",
            target: document,
            description: "enforce workspace upload permissions for standard users",
            handler: (e)=>{
                if (!['quarantine', 'personal-files', 'common files'].includes(Curate.workspaces.getOpenWorkspace()) && pydio.user.idmUser.Roles.find(r=>r.Label = "Standard User")){
                    Curate.ui.modals.curatePopup.fire({afterLoaded:(container)=>{
                        container.innerHTML = `<div class="config-modal-content">
                            <div class="config-popup-title">
                                <h2>You do not have permission to upload to this workspace.</h2>
                                <p>Please upload your content to the Quarantine workspace instead.</p>
                            </div>
                        </div>`;
                    }})
                    e.stopImmediatePropagation()
            }}
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