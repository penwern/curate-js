export class TimelineControlPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Enable shadow DOM

        // Template for the component
        this.shadowRoot.innerHTML = `
        <div>
            <div>
                <div id="control-panel">
                <div id="drag-area" class="handle">
                    <div class="app-title">State Timeline</div>
                    <div id="drag-area-buttons">
                    <button id="minimise">-</button>
                    </div>
                </div>
                <div class="controls-container">
                    <div class="button-controls">
                    <button id="prevButton">Prev</button>
                    <button id="playButton">Play</button>
                    <button id="pauseButton">Pause</button>
                    <button id="stopButton">Stop</button>
                    <button id="nextButton">Next</button>
                    <button id="loopButton">⟳</button>
                    </div>
                    <span style="font-size:small;">Playback Speed</span>
                    <input id="inverseSlider" type="range" min="20" max="1500" />
                </div>
                <div id="current-step-display">Move the slider to scrub through time</div>
                <div id="timeScrubber">
                    <label class="heat-slider heat-slider--v">
                    <span class="heat-slider--input">
                        <input id="timeline-slider" type="range" value="0" min="0"/>
                    </span>
                    </label>
                </div>
                <div id="current-value-display"></div>
                <canvas id="data-timeline" width="800" height="150"></canvas>
                <div id="resize-handle"></div>
                </div>
                <!-- Modal for displaying object details -->
                <div id="modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <pre id="modal-text"></pre>
                </div>
                </div>
            </div>
            <style>
                body, html {
                    height: 100%;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background: #f1f1f1;
                }
                
                #control-panel {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: rgb(57 57 57 / 80%);
                    border-radius: 10px;
                    color: white;
                    padding: 1em;
                    z-index: 1000;
                    width: 350px; /* Fixed width to match the canvas */
                    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
                    user-select: none;
                    overflow: hidden; /* Ensures nothing overflows the boundary of the panel */
                }
                
                
                
                .slider {
                    width: 100%;
                }
                
                button, input {
                    margin-right: 5px;
                    padding: 5px 9px;
                    border: none;
                    background-color: #555;
                    color: white;
                    border-radius: 5px;
                }
                
                button:hover, input:hover {
                    background-color: #777;
                }
                .checked{
                background-color:#777;
                }
                #current-value-display {
                    color: #fff;
                    margin-top: 10px;
                    white-space: pre; /* Keeps formatting of new lines */
                }
                #data-timeline{
                width:98.5%;
                margin-top:0.5em;
                padding:0.2em;
                padding-top:0.3em;
                border:solid #b5b5b5 0.2em;
                border-radius:0.5em;
                background: #41595a;
                }
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1001;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0, 0, 0, 0.4);
                }
                
                .modal-content {
                    background-color: #fefefe;
                    margin: 15% auto;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 50%;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
                }
                
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }
                
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
                .button-controls{
                display:flex;
                justify-content:center;
                padding:0.2em;
                margin:0.3em;
                
                
                }
                .controls-container{
                    background: #888484;
                    border:solid #645858 2px;
                border-radius:0.5em;
                padding:0.2em;
                margin-bottom:0.3em;
                margin-top:0.3em;
                display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .controls-container input[type="range"]{
                width:90%;
                position:relative;
                    padding: 0;
                }
                #current-step-display {
                    text-align: center;
                    color: #fff;
                    padding: 10px 0;
                }
                #current-value-display{
                background: gray;
                padding:0.5em;
                border-radius:0.5em;
                display: flex;
                    flex-direction: column;
                }
                .display-text{
                display:inline-flex;
                margin:0.1em;
                }
                .display-text div{
                margin-left:0.2em;
                }
                #current-step-display{
                    text-align: center;
                    color: #fff;
                    padding: 10px 0;
                    background: #898886;
                    margin-bottom: 0.3em;
                    border-radius: 0.5em;
                }
                .display-state-name{
                padding:0.2em;
                background:#595959;
                border-radius:0.3em;
                font-size:small;
                }
                .display-state-Text{
                background:#595959;
                padding-right:0.3em;
                border-radius:0.2em;
                font-size:0.8em;
                display: flex;
                    align-items: center;
                }
                #drag-area-buttons{
                width: fit-content;
                
                }
                #drag-area {
                    cursor: move;
                    background-color: #333;
                    padding: 10px;
                    text-align: center;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    display:flex;
                justify-content: space-between;
                    align-items: center;
                }
                .app-title{
                width: fit-content;
                pointer-events: none;
                }
                #resize-handle {
                    width: 10px;
                    height: 10px;
                    background-color: #333;
                    border-radius: 50%;
                    cursor: se-resize;
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin: 0.45em;
                }
                .heat-slider--h {
                    display: flex;
                    align-items: center;
                }
                .heat-slider--h .heat-slider--label + * {
                    margin-left: 1em;
                    flex: 1;
                }
                .heat-slider--v {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .heat-slider--v .heat-slider--label + * {
                    margin-top: 1em;
                    flex: 1;
                }
                .heat-slider {
                    --slider-base: #d8d8d8;
                    --turquoise-light: #66d8cf;
                    --turquoise-base: #1abc9c;
                    --turquoise-dark: #3ca28d;
                    --slider-radius: 1em;
                    --slider-handle-size: 1em;
                    --p: 0%;
                }
                .heat-slider--input {
                    position: relative;
                    line-height: 0;
                    border-radius: var(--slider-radius);
                    background-image: linear-gradient(to right, var(--turquoise-light), var(--turquoise-base), var(--turquoise-dark));
                    background-size: 300% 100%;
                    animation: shiftGradient 4s ease-in-out infinite;
                }
                .heat-slider--input::before {
                    content: '';
                    position: absolute;
                    pointer-events: none;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    margin-right: -1px;
                    border-radius: var(--slider-radius);
                    background: linear-gradient(to right, transparent 0, transparent calc(var(--p) + var(--slider-handle-size) / 2), var(--slider-base) var(--p), var(--slider-base) 100%);
                }
                .heat-slider--input input {
                    position: realtive;
                    z-index: 1;
                    width: 100%;
                    appearance: none;
                    font: inherit;
                    background: transparent;
                    border: 0;
                    margin: 0;
                    padding: 0;
                }
                .heat-slider--input input::-webkit-slider-runnable-track {
                    background: transparent;
                    padding: calc(var(--slider-handle-size) / 1.6) 0;
                    margin: 0 calc(var(--slider-handle-size) / 2 * -1);
                    cursor: pointer;
                }
                .heat-slider--input input::-moz-range-track {
                    background: transparent;
                    padding: calc(var(--slider-handle-size) / 1.6) 0;
                    margin: 0 calc(var(--slider-handle-size) / 2 * -1);
                    cursor: pointer;
                }
                .heat-slider--input input::-webkit-slider-thumb {
                    position: relative;
                    appearance: none;
                    box-shadow: 0 0 0 0.1em #444;
                    height: calc(var(--slider-handle-size) * 1.6);
                    width: var(--slider-handle-size);
                    margin: calc(var(--slider-handle-size) * -0.8) 0;
                    border-radius: var(--slider-radius, 1em);
                    background: white;
                    cursor: grab;
                    left: 0.1em;
                }
                .heat-slider--input input::-moz-range-thumb {
                    position: relative;
                    appearance: none;
                    box-shadow: 0 0 0 0.1em #444;
                    height: calc(var(--slider-handle-size) * 2);
                    width: var(--slider-handle-size);
                    margin: calc(var(--slider-handle-size) * -1) 0;
                    border-radius: var(--slider-radius, 1em);
                    background: white;
                    cursor: grab;
                    left: 0.1em;
                }
                .heat-slider--input input:focus {
                    outline: none;
                }
                .heat-slider--input input:active::-webkit-slider-thumb {
                    position: relative;
                    appearance: none;
                    box-shadow: 0 0 0 0.1em #444;
                    height: calc(var(--slider-handle-size) * 2);
                    width: var(--slider-handle-size);
                    margin: calc(var(--slider-handle-size) * -1) 0;
                    border-radius: var(--slider-radius, 1em);
                    background: white;
                    cursor: grabbing;
                    left: 0.1em;
                }
                .heat-slider--input input:active::-moz-range-thumb {
                    position: relative;
                    appearance: none;
                    box-shadow: 0 0 0 0.1em #444;
                    height: calc(var(--slider-handle-size) * 2);
                    width: var(--slider-handle-size);
                    margin: calc(var(--slider-handle-size) * -1) 0;
                    border-radius: var(--slider-radius, 1em);
                    background: white;
                    cursor: grabbing;
                    left: 0.1em;
                }
                @keyframes shiftGradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                *, *::before, *::after {
                    box-sizing: border-box;
                }
                .output {
                    margin: 1em;
                
                    text-align:center;
                
                    opacity: 0.4;
                    
                }
                #timeScrubber{
                margin-top:0.5em;
                }
            </style>
        </div>
        `;

      
    }

    connectedCallback() {
        // Called when the element is added to the document
          // Setup properties
          this.values = [];
          this.isPlaying = false;
          this.currentFrame = 0;
          this.loopOn = false
          this.controlPanel = this.shadowRoot.getElementById('control-panel');
          this.canvas = this.shadowRoot.getElementById('data-timeline');
          console.log("canvnvnvnvnvnvnvnv: ", this.canvas)
          this.ctx = this.canvas.getContext('2d');
          console.log("canvnvnvnvnvnvnvnvtxxxxxxxxxx: ", this.ctx)
          this.playButton = this.shadowRoot.getElementById('playButton');
          this.pauseButton = this.shadowRoot.getElementById('pauseButton');
          this.stopButton = this.shadowRoot.getElementById('stopButton');
          this.timelineSlider = this.shadowRoot.getElementById('timeline-slider');
          this.currentValueDisplay = this.shadowRoot.getElementById('current-value-display');
          this.prevButton = this.shadowRoot.getElementById('prevButton');
          this.nextButton = this.shadowRoot.getElementById('nextButton');
          this.currentStepDisplay = this.shadowRoot.getElementById('current-step-display');
          this.dragArea = this.shadowRoot.getElementById('drag-area');
          this.resizeHandle = this.shadowRoot.getElementById('resize-handle');
          this.modal = this.shadowRoot.getElementById('modal');
          this.modalText = this.shadowRoot.getElementById('modal-text');
          this.closeModal = this.shadowRoot.querySelector(".close");
          this.loopOnButton = this.shadowRoot.querySelector("#loopButton");
          this.slider = this.shadowRoot.querySelector('#inverseSlider');
          this.max = this.slider.max;
          this.min = this.slider.min;
          this.value = this.slider.value;
        //this.render();
        this.setupEventListeners()
    }

    setData(values, keys) {
        if (!values || !keys){
            return
        }
        const v = []
        keys.forEach(proxyKey=>{
            v.push({key:proxyKey,value:values.get(proxyKey[0])})  
        })
        console.log("yooo: ", v)
        this.values = v;
        this.timelineSlider.max = this.values[0]?.value.length - 1;
        this.render();
    }

    render() {
       
        this.updateStepDisplay();
        this.setCanvasSizeAndDraw();
   
    }
    playTimeline() {
        
        const inverseValue = this.max*1 + this.min*1 - this.slider.value;

        if (this.isPlaying && this.currentFrame < this.values[0].value.length) {
            this.value = this.currentFrame;
            this.timelineSlider.value = this.value

            this.drawTimeline();
            this.updateValueDisplay();

            const parent = this.shadowRoot.querySelector(".heat-slider--input")
            const percent = `${(((this.value / (this.values[0].value.length - 1)) * 100).toFixed(2))}%`;
            
            //const percent = `${((this.currentFrame - min)/(max - min) * 100).toFixed(decimals)}%`
            parent.style.setProperty('--p', percent)
            this.currentFrame++;
            setTimeout(this.playTimeline.bind(this), inverseValue);

        }else if(this.currentFrame == this.values[0].value.length && this.loopOn){
            this.currentFrame=0;
            this.timelineSlider.value = this.currentFrame;
            this.drawTimeline();
            this.updateValueDisplay();
            const parent = this.shadowRoot.querySelector(".heat-slider--input")
            const percent = `${((this.currentFrame / this.values[0].value.length) * 100).toFixed(5)}%`
            //const percent = `${((this.currentFrame - min)/(max - min) * 100).toFixed(decimals)}%`
            parent.style.setProperty('--p', percent)
            this.playTimeline()
        }
    }
    
    setupEventListeners(){
         // Close modal event
         this.closeModal.onclick = ()=> {
            this.modal.style.display = "none";
        };

        window.onclick = (event)=> {
            if (event.target === this.modal) {
                this.modal.style.display = "none";
            }
        };

        // Previous button event listener
        this.prevButton.addEventListener('click', ()=> {
            if (this.currentFrame > 0) {
                this.currentFrame--;
                this.timelineSlider.value = this.currentFrame;
                this.drawTimeline();
                //updateValueDisplay();
                this.updateStepDisplay();
                this.updateBar();
            }
        });

        // Next button event listener
        this.nextButton.addEventListener('click', ()=> {
            if (this.currentFrame < this.values[0].value.length - 1) {
                this.currentFrame++;
                this.timelineSlider.value = this.currentFrame;
                this.drawTimeline();
                this.updateValueDisplay();
                this.updateStepDisplay();
                this.updateBar();
            }
        });

        this.playButton.addEventListener('click', ()=> {
            this.isPlaying = true;
            this.playTimeline();
        });
    
        this.pauseButton.addEventListener('click', ()=>{
            this.isPlaying = false;
        });
    
        this.stopButton.addEventListener('click', ()=> {
            this.isPlaying = false;
            this.currentFrame = 0;
            this.timelineSlider.value = 0;
            this.drawTimeline();
            this.updateValueDisplay();
            this.updateBar();
        });

        
        this.timelineSlider.addEventListener('input', ()=> {
            this.currentFrame = parseInt(this.timelineSlider.value, 10);
            this.drawTimeline();
            this.updateValueDisplay();
            this.updateBar()
        });

        // Make the control panel draggable
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        this.controlPanel.addEventListener('mousedown', (e) => {
            if (e.target !== this.dragArea) return;
            isDragging = true;
            dragOffsetX = e.offsetX;
            dragOffsetY = e.offsetY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            this.controlPanel.style.left = e.clientX - dragOffsetX + 'px';
            this.controlPanel.style.top = e.clientY - dragOffsetY + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Make the control panel resizable
        let isResizing = false;
        let startWidth = 0;
        let startHeight = 0;
        let startMouseX = 0;
        let startMouseY = 0;

        this.resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startWidth = this.controlPanel.offsetWidth;
            startHeight = this.controlPanel.offsetHeight;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            // Calculate the new width and height based on the movement
            const newWidth = startWidth - (e.clientX - startMouseX);
            const newHeight = startHeight - (e.clientY - startMouseY);

            // Set the new width and height
            this.controlPanel.style.width = newWidth + 'px';
            this.controlPanel.style.height = newHeight + 'px';

            // Adjust the position of the control panel to move it along with the resizing
            this.controlPanel.style.left = e.clientX + 'px';
            this.controlPanel.style.top = e.clientY + 'px';
        });


        document.addEventListener('mouseup', () => {
            isResizing = false;
        });

        this.loopOnButton.addEventListener("click", e=>{
            console.log("do")
            if (this.loopOn === false){
                this.loopOn = true
            }else{
                this.loopOn = false
            }
            this.loopOnButton.classList.toggle("checked")
        })
    }

    //methods
    updateSlider = (event) => {
        const { value, min, max, step, parentElement: parent } = event.target
        const decimals = step && step.includes('.') ? step.split('.')[1] : 1
        const percent = `${((value - min)/(max - min) * 100).toFixed(decimals)}%`
        parent.style.setProperty('--p', percent)
    }

    
    updateStepDisplay() {
        if (!this.values[0]?.value) {
            console.log("this.values[0]?.value is undefined or empty");
            return;
        }
    
        const maxFrame = this.values[0].value.length - 1;
        console.log("max frame: ", maxFrame);
    
        if (isNaN(maxFrame) || maxFrame < 0) {
            console.log("maxFrame is NaN or less than 0");
            return;
        }
    
        if (isNaN(this.currentFrame)) {
            console.log("this.currentFrame is NaN");
            return;
        }
    
        let percentage = Math.max(0, (this.currentFrame / maxFrame)) * 100;
    
        if (!this.currentStepDisplay) {
            console.log("this.currentStepDisplay is not defined or not a valid DOM element");
            return;
        }
    
        const stepText = `Step ${this.currentFrame}`;
        const ofText = ` of ${maxFrame}`;
        const percentageText = ` (${percentage.toFixed(2)}%)`;
    
        console.log(`stepText: ${stepText}`);
        console.log(`ofText: ${ofText}`);
        console.log(`percentageText: ${percentageText}`);
    
        // Update the DOM element's text content
        this.currentStepDisplay.textContent = stepText + ofText + percentageText;
    
        console.log(`Set textContent: ${this.currentStepDisplay.textContent}`);
    }
    
    

    updateBar = () =>{
        const parent = this.shadowRoot.querySelector(".heat-slider--input")
        const percent = `${(((this.currentFrame / (this.values[0].value.length - 1)) * 100).toFixed(2))}%`;

        console.log("percent: ", percent)
        //const percent = `${((this.currentFrame - min)/(max - min) * 100).toFixed(decimals)}%`
        parent.style.setProperty('--p', percent)
    }

    updateValueDisplay() {
        if (!this.values[0]?.value) return
        let percentage = (this.currentFrame / (this.values[0].value.length-1)) * 100;
        this.currentStepDisplay.textContent = `Step ${this.currentFrame} of ${this.values[0].value.length - 1} (${percentage.toFixed(2)}%)`;
        this.currentValueDisplay.innerHTML = '';
        this.values.forEach((state, arrayIndex) => {
            const array = state.value
            const value = array[this.currentFrame];
            
            let displayText = document.createElement('div');
            displayText.className = "display-text"
            let displayStateName = document.createElement('div');
            displayStateName.className = "display-state-name"
            let displayStateText = document.createElement('div');
            displayStateText.className = "display-state-Text"
            displayText.appendChild(displayStateName)
            displayText.appendChild(displayStateText)
            if (value !== null && typeof value === 'object' && !(value instanceof String || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
                displayStateName.textContent = `State ${arrayIndex + 1}:`
                displayStateText.textContent = ` [${value.constructor.name}]`;
                displayText.onclick = ()=> {
                    this.modal.style.display = "block";
                    this.modalText.textContent = JSON.stringify(value, null, 2);
                };
            } else {
                displayStateName.textContent = `State ${arrayIndex + 1}:`
                displayStateText.textContent = ` ${value || 'None'}`;
            }
            this.currentValueDisplay.appendChild(displayText);
        });
    }

    drawTimeline() {
        if (!this.values[0]?.value) return
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const numberOfSteps = this.values[0].value.length;
        const segmentWidth = (this.canvas.width / numberOfSteps);
        const segmentHeight = 20; // fixed height for each segment
        const gap = 3; // Gap between rows
        const cornerRadius = 5; // Radius of rounded corners
        const gridLineWidth = 0.5;
        const padding = 2.5; 
        // Function to draw rounded rectangles
        const fillRoundRect = (x, y, width, height, radius)=>{
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.arcTo(x + width, y, x + width, y + height, radius);
            this.ctx.arcTo(x + width, y + height, x, y + height, radius);
            this.ctx.arcTo(x, y + height, x, y, radius);
            this.ctx.arcTo(x, y, x + width, y, radius);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.values.forEach((state, arrayIndex) => {
            const array = state.value
            array.forEach((item, index) => {
                if (item !== null) {
                    const byteSize = typeof item === 'string' ? new Blob([item]).size : 10;
                    const hue = 120 - (byteSize * 10);
                    const color = `hsl(${hue}, 70%, 50%)`;
                    this.ctx.fillStyle = color;

                
                    const width = segmentWidth - (2 * padding) - 2;
                    const height = segmentHeight - (2 * padding);
    // Calculate the centered position within the cell (CORRECTED)
                    const x = (index * segmentWidth) + (segmentWidth - width) / 2;
                    const y = (arrayIndex * (segmentHeight + gap)) + (gap / 2) + (segmentHeight - height) / 2;

                    fillRoundRect(x, y, width, height, cornerRadius);
                }
            });
        });
        // Draw Grid (NEW)
        this.ctx.strokeStyle = 'navy';
        this.ctx.lineWidth = gridLineWidth;
        this.ctx.beginPath(); // Start drawing the lines

        // Vertical Lines (except on edges)
        for (let i = 1; i < numberOfSteps; i++) {
            const x = i * segmentWidth;
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
        }

        // Horizontal Lines (except on edges)
        for (let i = 1; i < this.values.length; i++) {
            const y = i * (segmentHeight + gap);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }

        this.ctx.stroke(); // Render the lines
        // Draw cursor
        this.ctx.fillStyle = '#ffffff'; // White cursor
        this.ctx.fillRect(this.currentFrame * segmentWidth, 0, 2, this.canvas.height);
    }

    setCanvasSizeAndDraw() {
        this.canvas.width = this.controlPanel.offsetWidth; // Match the canvas width with the control panel

        // Calculate and set canvas height based on the number of arrays and the space needed for each plus a gap
        const segmentHeight = 20;
        const gap = 3; // Gap between rows
        this.canvas.height = this.values.length * (segmentHeight + gap); // Update canvas height based on contents

        this.drawTimeline();
        this.updateValueDisplay(); // Ensure value display is also updated
    }

}

// Define the custom element
customElements.define('timeline-control-panel', TimelineControlPanel);
