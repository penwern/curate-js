class ConnectToAtom extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.apiKey = '';
    this.atomUrl = '';
    this.username = '';
    this.password = '';
    this.render();
    this.retrieveDetails();
  }

  retrieveDetails() {
    Curate.api.fetchCurate(':6900/atom', 'GET')
      .then(response => {
        this.apiKey = response.apiKey;
        this.atomUrl = response.atomUrl;
        this.username = response.username;
        this.password = response.password;
        this.render();
      })
      .catch(error => {
        console.error('Error retrieving details from Atom:', error);
      });
  }

  saveDetails(e) {
    e.preventDefault();
    Curate.api.fetchCurate('/atom/config', 'PUT', {
      apiKey: this.apiKey,
      atomUrl: this.atomUrl,
      username: this.username,
      password: this.password
    })
      .then(response => {
        console.log('Saved Atom details:', response);
      })
      .catch(error => {
        console.error('Error saving Atom details:', error);
      });
    if (this.apiKey !== '') {
      localStorage.setItem('atom_api_key', this.apiKey);
      console.log('Saving API Key:', this.apiKey);
    }

    if (this.atomUrl !== '') {
      localStorage.setItem('atom_url', this.atomUrl);
      console.log('Saving Atom URL:', this.atomUrl);
    }

    if (this.username !== '') {
      localStorage.setItem('atom_username', this.username);
      console.log('Saving Atom Username:', this.username);
    }

    if (this.password !== '') {
      localStorage.setItem('atom_password', this.password);
      console.log('Saving Atom Password:', this.password);
    }

    this.render();
  }

  handleApiKeyChange(event) {
    this.apiKey = event.target.value;
  }

  handleUrlChange(event) {
    this.atomUrl = event.target.value;
  }

  handleUsernameChange(event) {
    this.username = event.target.value;
  }

  handlePasswordChange(event) {
    this.password = event.target.value;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          max-width: 500px;
          min-width: 30em;
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
          background-color: var(--md-sys-color-inverse-on-surface);
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
          <p style="font-size: 16px;">Current Username: <span class="current-details" id="current-username">${localStorage.getItem('atom_username') || ''}</span></p>
          <p style="font-size: 16px;">Current Password: <span class="current-details" id="current-password">${localStorage.getItem('atom_password') || ''}</span></p>
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
          <div class="form-group">
            <label class="label" for="username">Enter Username:</label>
            <input class="input" type="text" id="username" name="username" placeholder="Enter Username">
          </div>
          <div class="form-group">
            <label class="label" for="password">Enter Password:</label>
            <input class="input" type="password" id="password" name="password" placeholder="Enter Password">
          </div>
          <button class="save-btn" type="submit">Save</button>
        </form>
      </div>
    `;

    this.shadowRoot.querySelector('#details-form').addEventListener('submit', (e) => this.saveDetails(e));
    this.shadowRoot.querySelector('#api-key').addEventListener('input', (e) => this.handleApiKeyChange(e));
    this.shadowRoot.querySelector('#atom-url').addEventListener('input', (e) => this.handleUrlChange(e));
    this.shadowRoot.querySelector('#username').addEventListener('input', (e) => this.handleUsernameChange(e));
    this.shadowRoot.querySelector('#password').addEventListener('input', (e) => this.handlePasswordChange(e));
  }
}

customElements.define('connect-to-atom', ConnectToAtom);