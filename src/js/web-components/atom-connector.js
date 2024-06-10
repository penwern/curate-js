class ConnectToAtom extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.apiKey = '';
      this.render();
    }
  
    saveApiKey(e) {
      e.preventDefault(); 
      localStorage.setItem('atom_api_key', this.apiKey);
      console.log('Saving API Key: ', this.apiKey);
      this.render();
    }
  
    handleInputChange(event) {
      this.apiKey = event.target.value;
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
          .api-key-display {
            margin-top: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f2f2f2;
            border-radius: 4px;
          }
          .current-api-key {
            font-weight: bold;
            font-size: 16px;
          }
        </style>
        <div class="container">
          <div class="api-key-display">
            <p style="font-size: 16px;">Current API Key: <span class="current-api-key" id="current-api-key">${localStorage.getItem('atom_api_key') || ''}</span></p>
          </div>
          <form id="api-key-form">
            <div class="form-group">
              <label class="label" for="api-key">Enter an API Key:</label>
              <input class="input" type="text" id="api-key" name="api-key" placeholder="Enter a New API key" required>
            </div>
            <button class="save-btn" type="submit">Save</button>
          </form>
        </div>
      `;
  
      this.shadowRoot.querySelector('#api-key-form').addEventListener('submit', (e) => this.saveApiKey(e));
      this.shadowRoot.querySelector('#api-key').addEventListener('input', (e) => this.handleInputChange(e));
    }
  }
  
  customElements.define('connect-to-atom', ConnectToAtom);
  