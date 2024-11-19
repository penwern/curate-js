/**
 * There is a bug in the info panel that causes it to automatically scroll to the comments section when the selection changes
 * it then gets stuck in a weird state where you cannot scroll up to reveal the full pane, you first need to scroll down
 * beyond the bottom of the panel in order to be able to scroll up again.
 *
 * This fix is a workaround for that bug. Because of the way the component works, the 'top' of the info panel is relative,
 * so if we scroll to 0, it will just scroll to where the user already was in the previous state.
 *
 * This seems to override the issue and you can scroll the full panel, and it does not change your position in the panel
 * unless you are changing the selection to something with more or fewer cards in the panel.
 */
window.addEventListener("load", function () {
  // wait for "pydio" object to be defined
  const waitForPydio = () => {
    return new Promise((resolve, reject) => {
      (function checkPydio() {
        if (typeof pydio !== "undefined") {
          resolve();
        } else {
          setTimeout(checkPydio, 100); // Check again in 100ms
        }
      })();
    });
  };

  waitForPydio().then(() => {
    pydio._dataModel.observe("selection_changed", function (event) {
      // Observe the selection change event

      setTimeout(() => {
        // Wait for the info panel to be rendered
        const infoScrollContainer = document.querySelector("#info_panel > div"); // Get the info panel container
        if (infoScrollContainer) {
          infoScrollContainer.scrollTo({
            top: 0, // Vertical scroll position in pixels
            left: 0, // Horizontal scroll position in pixels
          });
        }
      }, 50);
    });
  });
});
