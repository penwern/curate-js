const permissionHandlers = {
    upload:{
        enforceWorkspaceUpload:{
            event: "drop",
            target: document,
            description: "enforce workspace upload permissions for standard users",
            handler: (e)=>{
                if (!['quarantine', 'personal-files', 'common files'].includes(Curate.workspaces.getOpenWorkspace()) && pydio.user.idmUser.Roles.find(r=>r.Label = "Standard User")){
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