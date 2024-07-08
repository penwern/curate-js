// Define the web component
class OAIHarvestStatus extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          }
          .status-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }
          .status-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          .status-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }
          .status-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .status-title {
            font-weight: bold;
            color: #333;
          }
          .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
          }
          .status-details {
            font-size: 0.9em;
            color: #666;
          }
          .status-message {
            margin-top: 10px;
            font-style: italic;
            color: #888;
          }
          .loading { background-color: #ffd700; }
          .success { background-color: #4caf50; }
          .error { background-color: #f44336; }
          .progress-bar {
            height: 4px;
            background-color: #e0e0e0;
            border-radius: 2px;
            margin-top: 10px;
            overflow: hidden;
          }
          .progress-bar-fill {
            height: 100%;
            background-color: #2196f3;
            transition: width 0.3s ease;
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          .pulsing {
            animation: pulse 1.5s infinite ease-in-out;
          }
        </style>
        <div class="status-container"></div>
      `;
    }
  
    setupEventListeners() {
      window.addEventListener('oai-harvest-update', (event) => {
        this.updateStatus(event.detail);
      });
    }
  
    updateStatus(detail) {
      const container = this.shadowRoot.querySelector('.status-container');
      let statusItem = container.querySelector(`[data-id="${detail.id}"]`);
      
      if (!statusItem) {
        statusItem = document.createElement('div');
        statusItem.classList.add('status-item');
        statusItem.setAttribute('data-id', detail.id);
        container.appendChild(statusItem);
      }
  
      const statusClass = detail.status === 'loading' ? 'loading' : 
                          detail.status === 'success' ? 'success' : 
                          'error';
  
      statusItem.innerHTML = `
        <div class="status-header">
          <span class="status-title">${detail.title}</span>
          <span class="status-indicator ${statusClass} ${detail.status === 'loading' ? 'pulsing' : ''}"></span>
        </div>
        <div class="status-details">${detail.details}</div>
        ${detail.message ? `<div class="status-message">${detail.message}</div>` : ''}
        ${detail.status === 'loading' ? `
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${detail.progress || 0}%"></div>
          </div>
        ` : ''}
      `;
    }
  }
  
  // Register the web component
  customElements.define('oai-harvest-status', OAIHarvestStatus);