const elementsToFind = [
  // Expressions should return the element to remove
  (doc) => doc.querySelector(".icomoon-cells")?.closest("button"),
  (doc) => doc.querySelector(".layout-fill"),
];

function modifyConsole() {
  console.log("console modifier");
  // wait for pydio to be loaded
  if (!pydio) {
    setTimeout(modifyConsole, 100);
    return;
  }
  if (!pydio.user.isAdmin) {
    pydio.observe("context_changed", (e) => {
      if (e._label === "Settings") {
        const observer = new MutationObserver(() => {
          let removedSomething = false;

          elementsToFind.forEach((finder) => {
            const element = finder(document);
            if (element) {
              element.remove();
              removedSomething = true;
            }
          });

          if (removedSomething) {
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    });
  }

  window.removeEventListener("load", modifyConsole);
}

window.addEventListener("load", modifyConsole);
