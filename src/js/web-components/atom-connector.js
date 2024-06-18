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

  togglePasswordVisibility() {
    const passwordInput = this.shadowRoot.querySelector('#password');
    const toggleButton = this.shadowRoot.querySelector('#toggle-password');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleButton.textContent = 'Hide';
    } else {
      passwordInput.type = 'password';
      toggleButton.textContent = 'Show';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
       .container {
          max-width: 500px;
          min-width: 30em;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
        }
        .heading {
          text-align: center;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 500;
          color: #333;
        }
        .form-group {
          margin-bottom: 20px;
          position: relative;
        }
        .label {
          display: block;
          margin-bottom: 5px;
          font-size: 16px;
          color: #666;
        }
        .input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ddd;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .input:focus {
          border-color: #d15400;
          outline: none;
        }
        .toggle-password {
          position: absolute;
          top: 70%;
          right: 10px;
          transform: translateY(-50%);
          background: #e9e9e9;
          border: none;
          border-radius:0.2em;
          padding: 0.4em;
          font-size: 16px;
          cursor: pointer;
        }
        .save-btn {
          display: block;
          width: 100%;
          padding: 12px;
          font-size: 18px;
          background-color: #ff6600;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .save-btn:hover {
          background-color: #d15400;
        }
        .details-display {
          margin-top: 20px;
          margin-bottom: 20px;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          border-left: 4px solid #ff6600;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          color: #333;
        }
        .detail-item .label {
          font-weight: 500;
        }
        .detail-item .value {
          color: #666;
        }
      </style>
      <div class="container">
        <div class="details-display">
          <div class="detail-item">
            <span class="label">Current API Key:</span>
            <span class="value" id="current-api-key">${localStorage.getItem('atom_api_key') || 'Not Set'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Current Atom URL:</span>
            <span class="value" id="current-atom-url">${localStorage.getItem('atom_url') || 'Not Set'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Current Username:</span>
            <span class="value" id="current-username">${localStorage.getItem('atom_username') || 'Not Set'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Current Password:</span>
            <span class="value" id="current-password">${localStorage.getItem('atom_password') || 'Not Set'}</span>
          </div>
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
            <button type="button" class="toggle-password" id="toggle-password">Show</button>
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
    this.shadowRoot.querySelector('#toggle-password').addEventListener('click', () => this.togglePasswordVisibility());
  }
}

customElements.define('connect-to-atom', ConnectToAtom);