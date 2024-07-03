const CurateUi = {
    modals: {
        /**
         * Creates a Curate popup with standard action buttons and base styling. 
         * The popup initialization and behavior are managed by the provided props and callbacks.
         * The `afterLoaded` callback is triggered after the popup is rendered in the DOM, 
         * and the `afterClosed` callback is triggered after the popup is removed from the DOM.
         * 
         * @usage 
         * const myPopup = new Curate.ui.modals.curatePopup(props, callbacks);
         * 
         * @param {Object} props - An object containing popup parameters.
         * @param {string} [props.title] - The title of the popup.
         * @param {string} [props.message] - The main message of the popup.
         * @param {string} [props.type] - The type of the popup ('warning', 'error', 'success', or 'info').
         * @param {Object} callbacks - An object containing callback functions for popup events.
         * @property {Function} callbacks.afterLoaded - Callback function that fires after the popup is spawned in the DOM.
         * @property {Function} callbacks.afterClosed - Callback function that fires after the popup is removed from the DOM.
         * @function fire - Initiates the popup in the DOM.
         */
        curatePopup : function(props, callbacks) {
            // Extracting props
            const title = props.title;
            const message = props.message;
            const type = props.type;
            const content = props.content;
            // Extracting callbacks or defaulting to empty objects
            const afterLoaded = callbacks && callbacks.afterLoaded ? callbacks.afterLoaded : function(){};
            const afterClosed = callbacks && callbacks.afterClosed ? callbacks.afterClosed : function(){};
        
            // Define type-specific styles and icons
            const typeStyles = {
                warning: { color: '#FFA500', icon: 'mdi-alert' },
                error: { color: '#FF0000', icon: 'mdi-alert-circle' },
                success: { color: '#008000', icon: 'mdi-check-circle' },
                info: { color: '#0000FF', icon: 'mdi-information' }
            };
        
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
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('config-modal-content');
                if (type) {
                    // Create the type-specific styles and icons
                    contentDiv.style.borderTop = `4px solid ${typeStyles[type].color}`;
                }
                
                // Create the title element
                const titleElem = document.createElement('div');
                titleElem.classList.add('config-popup-title');
                if (type) {
                    const iconElem = document.createElement('i');
                    iconElem.classList.add('mdi', typeStyles[type].icon);
                    iconElem.style.color = typeStyles[type].color;
                    iconElem.style.fontSize = '24px';
                    iconElem.style.marginRight = '10px';

                    titleElem.appendChild(iconElem);
                }
                const titleText = document.createTextNode(title);
                titleElem.appendChild(titleText);
        
                // Create the main body container
                const mainContent = document.createElement("div");
                mainContent.classList.add("config-main-options-container");
                mainContent.style.width = "100%";
                if (message) {
                    const messageElem = document.createElement("div");
                    messageElem.classList.add("config-popup-message");
                    messageElem.textContent = message;
                    mainContent.appendChild(messageElem);
                }

                if (content) {
                    const contentElem = document.createElement("div");
                    contentElem.innerHTML = content;
                    mainContent.appendChild(contentElem);
                }
        
                // Create the action buttons container
                const actionButtons = document.createElement('div');
                actionButtons.classList.add('action-buttons');
        
                // Create the close button
                const closeButton = document.createElement('button');
                closeButton.classList.add('config-modal-close-button');
                closeButton.textContent = 'Close';
                closeButton.addEventListener('click', e=>{
                    closePopup(container)
                });

        
                // Append elements to their respective parents
                actionButtons.appendChild(closeButton);
                contentDiv.appendChild(titleElem);
                contentDiv.appendChild(mainContent);
                contentDiv.appendChild(actionButtons);
                container.appendChild(contentDiv);
        
                // Append the container to the document body or any other desired parent element
                document.body.appendChild(container);

                // Add keystroke event listener that stops propagation of key events to the main UI to prevent triggering quick actions
                container.addEventListener("keyup", function (e) {
                    console.log("preventing propagation")
                    e.stopPropagation();
                });
        
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