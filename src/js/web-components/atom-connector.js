class ConnectToAtom extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.apiKey = '';
      this.atomUrl = '';
      this.render();
    }
  
    saveDetails(e) {
      e.preventDefault();
  
      if (this.apiKey !== '') {
        localStorage.setItem('atom_api_key', this.apiKey);
        console.log('Saving API Key:', this.apiKey);
      }
  
      if (this.atomUrl !== '') {
        localStorage.setItem('atom_url', this.atomUrl);
        console.log('Saving Atom URL:', this.atomUrl);
      }
  
      this.render();
    }
  
    handleApiKeyChange(event) {
      this.apiKey = event.target.value;
    }
  
    handleUrlChange(event) {
      this.atomUrl = event.target.value;
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
          }
          .heading {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .label {
            display: block;
            margin-bottom: 5px;
            font-size: 16px;
          }
          .input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
          .save-btn {
            display: block;
            width: 100%;
            padding: 12px;
            font-size: 18px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .save-btn:hover {
            background-color: #45a049;
          }
          .details-display {
            margin-top: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f2f2f2;
            border-radius: 4px;
          }
          .current-details {
            font-weight: bold;
            font-size: 16px;
          }
        </style>
        <div class="container">
          <div class="details-display">
            <p style="font-size: 16px;">Current API Key: <span class="current-details" id="current-api-key">${localStorage.getItem('atom_api_key') || ''}</span></p>
            <p style="font-size: 16px;">Current Atom URL: <span class="current-details" id="current-atom-url">${localStorage.getItem('atom_url') || ''}</span></p>
          </div>
          <form id="details-form">
            <div class="form-group">
              <label class="label" for="api-key">Enter an API Key:</label>
              <input class="input" type="text" id="api-key" name="api-key" placeholder="Enter a New API key">
            </div>
            <div class="form-group">
              <label class="label" for="atom-url">Enter Atom Site URL:</label>
              <input class="input" type="url" id="atom-url" name="atom-url" placeholder="https://atom.penwern.co.uk/">
            </div>
            <button class="save-btn" type="submit">Save</button>
          </form>
        </div>
      `;
  
      this.shadowRoot.querySelector('#details-form').addEventListener('submit', (e) => this.saveDetails(e));
      this.shadowRoot.querySelector('#api-key').addEventListener('input', (e) => this.handleApiKeyChange(e));
      this.shadowRoot.querySelector('#atom-url').addEventListener('input', (e) => this.handleUrlChange(e));
    }
  }
  
  customElements.define('connect-to-atom', ConnectToAtom);  