const elementsToFind = [
  // Expressions should return the element to remove
  (doc) => doc.querySelector(".icomoon-cells")?.closest("button"),
  (doc) => doc.querySelector(".layout-fill"),
];

function modifyConsole() {
  // Check if we're on the login page
  const isLoginPage = window.location.pathname.includes("/login");

  // If we're on login page, wait for navigation away from login
  if (isLoginPage) {
    const navigationObserver = new MutationObserver(() => {
      if (!window.location.pathname.includes("/login")) {
        navigationObserver.disconnect();
        // Once we've navigated away from login, reinitialize the modifier
        modifyConsole();
      }
    });

    navigationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    return;
  }

  // Regular pydio check
  if (!pydio?.user) {
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
