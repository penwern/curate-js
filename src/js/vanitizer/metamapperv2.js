class MetadataMapper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.destinationSchemas = [];
    this.sourceSchema = null;
    this.destinationSchema = null;
  }

  static get styles() {
    return `
        :host {
          display: block;
          width: 100%;
          max-height: inherit;
        }
        
        .metadata-mapper-main-containers {
          margin-bottom: 1em;
        }
  
        .config-text-label {
          font-weight: bold;
          margin-bottom: 0.5em;
        }
  
        .map-nodes-container {
          display: flex;
          justify-content: space-between;
          gap: 2em;
          margin: 1em 0;
        }
  
  
        .list {
          flex: 1;
          padding: 1em;
          background: #f8f8f8;
          border-radius: 4px;
        }
  
        .node {
          display: flex;
          align-items: center;
          margin: 0.5em 0;
          gap: 1em;
        }
  
        .item {
          flex: 1;
          padding: 0.5em;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: move;
        }
  
        .nodeConnector {
          width: 24px;
          height: 24px;
          border: 2px solid #9fd0c7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
  
        .nodeConnector.connected {
          background: #9fd0c7;
        }
  
        .nodeConnector.chooseConnection {
          background: #e6f3f1;
        }
  
        .nodeConnector.chooseDestination {
          animation: pulse 1.5s infinite;
        }
  
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

  
        select {
          margin-left: 0.5em;
          padding: 0.3em;
          border-radius: 4px;
        }
  
        .curate-basic-button {
          padding: 0.5em 1em;
          background: #9fd0c7;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
  
        #connectorCanvas {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
          /** metadata mapper**/
.map-nodes-container{
  background-color: var(--md-sys-color-hover-background);
  padding: 1em !important;
  border-radius: 1em;
  margin-bottom: 0.5em !important;
  display:flex;
}
.map-nodes-container .node .item{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
#metadata-mapper{
  overflow-y: scroll;
  width:58%;
}
#saved-mappings{
  width:38%;
}
.metadata-mapper-main-containers{
  background-color: var(--md-sys-color-secondary-container);
  padding: 1em !important;
  border-radius: 1em;
}
#destinationList .node{
  justify-content:flex-end;
}
/**darker colour for text and icons**/
.userLabel {
  color:#000046 !important 
}
.userActionIcon {
  color: #000046 !important 
}
.action_bar {
  color : #000046 !important 
}
/** css for metadata mapper**/
#mapper{
  overflow-y: scroll;
  max-height: inherit;
}
#connectorCanvas{
  position: absolute;
  left: 0;
  top: 0;
}
#connectorCanvas canvas{
  position: absolute;
  top: 0;
  left: 0;
  z-index:0;
  pointer-events:none;
}
.container {
  display: flex;
  position: relative;
 justify-content: space-around;
}
.glow {
  filter: drop-shadow(0 0 20px rgba(45, 255, 196, 0.9));
}
.list {
  padding: 10px;
  margin: 40px;
  width: 50%;
  display:flex;
  flex-direction:column;
}
.item {
  border-radius: 1em;
  padding: 0.5em !important;
  background-color: var(--md-sys-color-outline-variant-50);
  border: 1px solid #ccc;
  transition: transform 0.033s ease;
  width: 60%;
}
#connector {
  position: absolute;
  pointer-events:none;
  overflow:visible;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  display: block;
}
#connector line {
  pointer-events: all;
}
.dragging {
  opacity: 0.5;
}
line {
  transition: all 0.033s ease;
}
.node {
  display: inline-flex;
  margin-bottom: 0.5em !important;
  flex-wrap: nowrap;
}
.nodeConnector {
  display:flex;
  position: relative;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 0.5em;
  height: 0.5em;
  align-items:center;
  transition: ease all 0.3s;
}
.chooseConnection {
 background-color: #9fd0c7;
  border-radius: 50%;
  width:0.6em;
 height:0.6em;
 box-shadow: 0px 0px 15px 5px rgba(45,255,196,0.39);
}
.connected {
 background-color: #9fd0c7;
  border-radius: 50%;
}
.chooseDestination {
 background-color: cyan !important;
}
#destinationList .nodeConnector {
  right:10px;
  background-color: #9fd0c7;
  border-radius: 50%
}
#sourceList .nodeConnector {
  position: relative;
}
#destinationList .item {
  position: relative;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
  .curate-select-container{
  display: flex;
  background-color: var(--md-sys-color-field-underline-idle);
  padding: 0.5em !important;
  margin-bottom: 0.5em !important;
  border-radius: 0.5em;
  flex-direction: column;
}
.curate-select-container select{
  background-color: var(--md-sys-color-mimefont-background);
  border-radius: 0.5em;
  border: none;
  padding: 0.3em !important;
}
 
      `;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.fetchDestinationSchemas();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = `
        <style>${MetadataMapper.styles}</style>
        <div class="metadata-mapper-main-containers">
          <div class="config-text-label">Create or Edit Mappings</div>
          <div id="map-nodes-container" class="map-nodes-container">
            Choose a source and destination schema to map between to get started.
          </div>
          <div id="connectorCanvas"></div>
        </div>
        <div class="curate-select-container">
          <label for="sourceSchema">Select a source schema</label>
          <select id="sourceSchema">
            <option value="new schema">Create a new schema</option>
          </select>
        </div>
        <div class="curate-select-container">
          <label for="destinationSchema">Select a destination schema</label>
          <select id="destinationSchema">
            
          </select>
        </div>
        <button class="curate-basic-button">
          <span class="mdi mdi-format-list-checks"></span>
          Generate Map
        </button>
      `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  async fetchDestinationSchemas() {
    try {
      Curate.api.fetchCurate("/api/schema/schemas/list", "GET").then((data) => {
        console.log(data);
        this.destinationSchemas = data;
        this.populateDestinationSchemaSelect();
      });
    } catch (error) {
      console.error("Error fetching schemas:", error);
    }
  }

  async fetchSourceSchemas() {
    try {
      Curate.api
        .fetchCurate("/api/schema/mappings/list", "GET")
        .then((data) => {
          console.log(data);
          this.sourceSchemas = data;
          this.populateSourceSchemaSelect();
        });
    } catch (error) {
      console.error("Error fetching schemas:", error);
    }
  }

  processSchemas(namespaces) {
    namespaces.forEach((obj) => {
      const nsSet = obj.Label.split("-")[0];
      if (
        nsSet !== nsSet.toUpperCase() ||
        nsSet === "IMPORT" ||
        nsSet === "EXPORT"
      ) {
        return;
      }

      const field = {
        field: obj.Label,
        props: {},
      };

      const destinationSchema = this.destinationSchemas.find(
        (item) => item.schema === nsSet
      );
      if (!destinationSchema) {
        this.destinationSchemas.push({ schema: nsSet, fields: [field] });
      } else {
        destinationSchema.fields.push(field);
      }
    });
  }

  populateDestinationSchemaSelect() {
    const select = this.shadowRoot.querySelector("#destinationSchema");
    this.destinationSchemas.forEach((schema) => {
      const option = document.createElement("option");
      option.value = schema.label;
      option.textContent = schema.label;
      select.appendChild(option);
    });
  }

  populateSourceSchemaSelect() {
    const select = this.shadowRoot.querySelector("#sourceSchema");
    this.sourceSchemas.forEach((schema) => {
      const option = document.createElement("option");
      option.value = schema.label;
      option.textContent = schema.label;
      select.appendChild(option);
    });
  }

  setupEventListeners() {
    const sourceSelect = this.shadowRoot.querySelector("#sourceSchema");
    const destinationSelect =
      this.shadowRoot.querySelector("#destinationSchema");

    const generateButton = this.shadowRoot.querySelector(
      ".curate-basic-button"
    );

    sourceSelect.addEventListener("change", (e) =>
      this.handleSourceSchemaChange(e)
    );
    destinationSelect.addEventListener("change", (e) =>
      this.handleDestinationSchemaChange(e)
    );

    generateButton.addEventListener("click", () => this.generateMapping());
  }

  checkSchemas() {
    if (this.sourceSchema && this.destinationSchema) {
      console.log("ready to go!");
    }
  }
  handleSourceSchemaChange(e) {
    const selectedSchema = e.target.value;
    this.sourceSchema = selectedSchema;
    this.checkSchemas();
    console.log(selectedSchema);
  }

  handleDestinationSchemaChange(e) {
    const selectedSchema = e.target.value;
    this.destinationSchema = selectedSchema;
    this.checkSchemas();
    console.log(selectedSchema);
  }

  handleDropZoneClick(e) {
    if (e.target.id === "file-input") return;
    this.shadowRoot.querySelector("#file-input").click();
  }

  handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      this.processCSVFile(file);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processCSVFile(file);
    }
  }

  async processCSVFile(file) {
    try {
      const columnHeadings = await this.parseCSV(file);
      const selectedSchema =
        this.shadowRoot.querySelector("#destinationSchema").value;
      const destinationFields = this.destinationSchemas.find(
        (schema) => schema.schema === selectedSchema
      ).fields;
      // pass in the fieldnames of the source and destination schemas
      this.createNodeInterface(columnHeadings, destinationFields);
    } catch (error) {
      console.error("Error processing CSV:", error);
    }
  }

  parseCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split("\n");
        const headings = lines[0].split(",").map((heading) => heading.trim());
        resolve(headings);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  createNodeInterface(sourceHeadings, destinationFields) {
    const container = this.shadowRoot.querySelector("#map-nodes-container");
    container.innerHTML = "";

    const sourceList = this.createSourceList(sourceHeadings);
    const destinationList = this.createDestinationList(destinationFields);

    container.appendChild(sourceList);
    container.appendChild(destinationList);

    this.shadowRoot.querySelector("#metadata-mapper-dropzone").style.display =
      "none";
  }

  createSourceList(headings) {
    const sourceList = document.createElement("div");
    sourceList.id = "sourceList";
    sourceList.classList.add("list");

    const header = this.createListHeader("Source Schema");
    sourceList.appendChild(header);

    headings.forEach((heading, index) => {
      const node = this.createNode(heading, `source_${index}`, true);
      sourceList.appendChild(node);
    });

    return sourceList;
  }

  createDestinationList(fields) {
    const destinationList = document.createElement("div");
    destinationList.id = "destinationList";
    destinationList.classList.add("list");

    const header = this.createListHeader("Destination Schema");
    destinationList.appendChild(header);

    fields.forEach((field, index) => {
      const node = this.createNode(field.field, `dest_${index}`, false);
      destinationList.appendChild(node);
    });

    return destinationList;
  }

  createNode(label, id, isSource) {
    const node = document.createElement("div");
    node.classList.add("node");

    const item = document.createElement("div");
    item.classList.add("item");
    item.id = id;
    item.textContent = label;

    const connector = document.createElement("span");
    connector.classList.add("nodeConnector");
    connector.setAttribute("for-node", id);
    connector.textContent = "+";

    if (isSource) {
      connector.addEventListener("click", (e) =>
        this.handleSourceConnectorClick(e)
      );
      node.appendChild(item);
      node.appendChild(connector);
    } else {
      connector.addEventListener("click", (e) =>
        this.handleDestinationConnectorClick(e)
      );
      node.appendChild(connector);
      node.appendChild(item);
    }

    return node;
  }

  handleSourceConnectorClick(e) {
    const connector = e.target;
    this.shadowRoot
      .querySelectorAll("#sourceList .nodeConnector")
      .forEach((n) => {
        if (n.classList.contains("chooseConnection")) {
          n.classList.remove("chooseConnection");
          n.textContent = "+";
        }
      });

    connector.classList.add("chooseConnection");
    connector.textContent = "";

    this.shadowRoot
      .querySelectorAll("#destinationList .nodeConnector")
      .forEach((n) => {
        if (!n.classList.contains("connected")) {
          n.classList.add("chooseDestination");
        }
      });
  }

  handleDestinationConnectorClick(e) {
    const destConnector = e.target;
    if (destConnector.classList.contains("connected")) return;

    const sourceConnector = this.shadowRoot.querySelector(
      ".nodeConnector.chooseConnection"
    );
    if (!sourceConnector) return;

    this.createConnection(sourceConnector, destConnector);
    this.updateConnectorStates(sourceConnector, destConnector);
  }

  createConnection(sourceConnector, destConnector) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("from-node", sourceConnector.getAttribute("for-node"));
    canvas.setAttribute("to-node", destConnector.getAttribute("for-node"));

    const ctx = canvas.getContext("2d");
    const container = this.shadowRoot.querySelector("#connectorCanvas");

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    this.drawConnection(ctx, sourceConnector, destConnector);
    container.appendChild(canvas);
  }

  drawConnection(ctx, source, dest) {
    const sourceRect = source.getBoundingClientRect();
    const destRect = dest.getBoundingClientRect();

    ctx.beginPath();
    ctx.moveTo(sourceRect.right, sourceRect.top + sourceRect.height / 2);
    ctx.lineTo(destRect.left, destRect.top + destRect.height / 2);
    ctx.strokeStyle = "#9fd0c7";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  updateConnectorStates(source, dest) {
    source.classList.remove("chooseConnection");
    source.classList.add("connected");
    dest.classList.add("connected");

    this.shadowRoot
      .querySelectorAll("#destinationList .nodeConnector")
      .forEach((n) => {
        n.classList.remove("chooseDestination");
      });
  }

  generateMapping() {
    const mappings = [];
    this.shadowRoot
      .querySelectorAll("#connectorCanvas canvas")
      .forEach((canvas) => {
        const sourceId = canvas.getAttribute("from-node");
        const destId = canvas.getAttribute("to-node");

        const sourceNode = this.shadowRoot.querySelector(`#${sourceId}`);
        const destNode = this.shadowRoot.querySelector(`#${destId}`);

        mappings.push({
          field: sourceNode.textContent,
          mapsTo: destNode.textContent,
        });
      });

    const event = new CustomEvent("mapping-generated", {
      detail: { mappings },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

// Register the web component
customElements.define("metadata-mapper", MetadataMapper);

const metadataMapperPopup = new Curate.ui.modals.curatePopup(
  { title: "Metadata Mappings" },
  {
    afterLoaded: function (popup) {
      const mapper = document.createElement("metadata-mapper");
      popup.querySelector(".config-main-options-container").appendChild(mapper);

      mapper.addEventListener("mapping-generated", (e) => {
        console.log("Generated mappings:", e.detail.mappings);
      });
    },
  }
).fire();
