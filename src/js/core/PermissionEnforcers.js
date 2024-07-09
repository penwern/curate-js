const permissionHandlers = {
    upload:{
        enforceWorkspaceUpload:{
            event: "drop",
            target: document,
            description: "enforce workspace upload permissions for standard users",
            handler: (e)=>{
                pydio.user.getIdmUser().then(idmUser=>{
                    if (!['quarantine', 'personal-files', 'common files'].includes(Curate.workspaces.getOpenWorkspace()) && !idmUser.Roles.find(r=>r.Label = "Admin")){
                        e.stopImmediatePropagation()
                        const content = `<div>
                            <p>Please upload your content to the Quarantine workspace instead. This will ensure your content is correctly scanned for malware before being released into the system.</p>
                            <p>You can also upload your content to the Personal and Common Files workspaces, which is scanned for malware once but will not be quarantined and cannot be released into the system.</p>
                        </div>`;
                        Curate.ui.modals.curatePopup({"title": "You do not have permission to upload to this workspace", "type": "warning", "content":content}).fire() 
                    }
                })
            }
        }  
    },
    move:{

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