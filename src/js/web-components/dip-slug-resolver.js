import CurateUi from "../core/CurateFunctions/CurateUi";

class DipSlugResolver extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.nodes = [];
      this.render();
    }
  
    set nodes(nodes) {
      this.nodes = nodes;
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .container {
            border: 1px solid #ccc;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background: #f9f9f9;
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }
          .header {
            font-size: 18px;
            margin-bottom: 8px;
            color: #333;
          }
          .message {
            margin-bottom: 16px;
            color: #555;
          }
          .file-list {
            border: 1px solid #ddd;
            padding: 8px;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
          }
          .file-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .file-item:last-child {
            border-bottom: none;
          }
          .file-name {
            flex-grow: 1;
          }
          .link-button {
            padding: 4px 8px;
            background: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .link-button:hover {
            background: #0056b3;
          }
          .continue-btn {
            display: block;
            width: 100%;
            padding: 12px;
            font-size: 18px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 16px;
            text-align: center;
          }
          .continue-btn:hover {
            background-color: #45a049;
          }
        </style>
        <div class="container">
          <div class="header">DIP Generation Warning</div>
          <div class="message">
            The selected preservation configuration has DIP generation enabled. The following items do not have a linked AtoM description, which will cause DIP generation to fail.
          </div>
          <div class="file-list">
            ${this.files.map(file => `
              <div class="file-item">
                <span class="file-name">${file}</span>
                <button class="link-button" data-file="${file}">Add Description</button>
              </div>
            `).join('')}
          </div>
          <button class="continue-btn">Continue</button>
        </div>
      `;
  
      this.shadowRoot.querySelectorAll('.link-button').forEach(button => {
        button.addEventListener('click', () => {
          console.log(`Add description for ${button.getAttribute('data-file')}`);
          const searchInterface = document.createElement("atom-search-interface");
          searchInterface.setNode(node);
          this.shadowRoot.appendChild()
        });
      });
  
      this.shadowRoot.querySelector('.continue-btn').addEventListener('click', () => {
        console.log('Continue button clicked');
      });
    }
  }
  
  customElements.define('dip-slug-resolver', FileSelector);
  