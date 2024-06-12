const CurateUi = {
    modals: {
        /**
         * Create a Curate popup. Add content in the afterLoaded callback. 
         * clickAway, standard action buttons and base styling provided.
         * 
         * afterClosed callback also provided.
         * 
         * @usage const myPopup = new Curate.ui.modals.curatePopup(props, callbacks)
         * @param {object} props An object of popup parameters
         * @function fire() Initiates the popup in the DOM
         * @param {Object} callbacks Functions hooked to new popup
         * @property {function} callbacks.afterLoaded - Fires after the popup is spawned in the DOM
         * @property {function} callbacks.afterClosed - Fires after the popup is removed from the DOM
         * 
         */
        curatePopup : function(props, callbacks) {
            // Extracting props
            var title = props.title;
        
            // Extracting callbacks or defaulting to empty objects
            var afterLoaded = callbacks && callbacks.afterLoaded ? callbacks.afterLoaded : function(){};
            var afterClosed = callbacks && callbacks.afterClosed ? callbacks.afterClosed : function(){};
        
            // Define fire method
            function fire() {
                // Create the container element
                const container = document.createElement('div');
                container.classList.add('config-modal-container');
                container.style.display = 'flex';
                container.addEventListener("click", function (e) {
                    clickAway(e, container);
                }, { once: true });
                
        
                // Create the content element
                var content = document.createElement('div');
                content.classList.add('config-modal-content');
        
                // Create the title element
                var titleElem = document.createElement('div');
                titleElem.classList.add('config-popup-title');
                titleElem.textContent = title;
        
                // Create the main body container
                var mainContent = document.createElement("div");
                mainContent.classList.add("config-main-options-container");
                mainContent.style.width = "100%";
        
                // Create the action buttons container
                var actionButtons = document.createElement('div');
                actionButtons.classList.add('action-buttons');
        
                // Create the close button
                var closeButton = document.createElement('button');
                closeButton.classList.add('config-modal-close-button');
                closeButton.textContent = 'Close';
                closeButton.addEventListener('click', e=>{
                    closePopup(container)
                });

        
                // Append elements to their respective parents
                actionButtons.appendChild(closeButton);
                content.appendChild(titleElem);
                content.appendChild(mainContent);
                content.appendChild(actionButtons);
                container.appendChild(content);
        
                // Append the container to the document body or any other desired parent element
                document.body.appendChild(container);
        
                // Call afterLoaded callback with the created popup
                afterLoaded(container);
        
                function closePopup(container) {
                    container.remove();  
                    afterClosed();       
                }
                
        
                function clickAway(e, container) {
                    if (e.target === container) {
                        console.log("closed here: ", container)
                        closePopup(container);  // Calls closePopup specifically for this container
                    } else {
                        // Reattach the listener if the click wasn't on the container
                        container.addEventListener("click", function (e) {
                            clickAway(e, container);
                        }, { once: true });
                    }
                }
                
            }
        
            // Return an object with the fire method
            return {
                fire: fire
            };
        }
    }
};
export default CurateUi;