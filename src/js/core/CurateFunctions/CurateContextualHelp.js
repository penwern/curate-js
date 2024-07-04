

// Initialize a variable to hold the reference to the last right-clicked element
let lastRightClickedElement = null;

const CurateContextualHelp = {
    context:{
        page: window.location.pathname,
        lastRightClickedElement,
        selection: pydio._dataModel._selectedNodes || null
    }
};

function handleRightClick(event) {
  // Update the lastRightClickedElement with the target of the right click
  if (event.button === 2) {
    lastRightClickedElement = event.target;
  }
}

// Add the event listener to the document
window.addEventListener("load", ()=>document.addEventListener("mousedown", handleRightClick));

export default CurateContextualHelp;