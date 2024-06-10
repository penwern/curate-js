import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const ConnectToAtom = AirComponent('connect-to-atom', function() {
  const [apiKey, setApiKey] = createState('');
  function saveApiKey(e) {
    e.preventDefault(); 
    localStorage.setItem('atom_api_key', apiKey());
    console.log('Saving API Key: ', apiKey());
    window.location.reload();
  }
  const containerStyle = airCss({
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
  });

  const headingStyle = airCss({
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
  });

  const formGroupStyle = airCss({
    marginBottom: '20px',
  });

  const labelStyle = airCss({
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '16px',
  });

  const inputStyle = airCss({
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  });

  const saveBtnStyle = airCss({
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '18px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#45a049',
    },
  });

  const apiKeyDisplayStyle = airCss({
    margin: {
        top: '20px',
        bottom: '20px',
    },
    padding: '15px',
    backgroundColor: '#f2f2f2',
    borderRadius: '4px',
  });

  const currentApiKeyStyle = airCss({
    fontWeight: 'bold',
    fontSize: '16px',
  });

  return () => html`
    <div style="${containerStyle}">
      <h2 style="${headingStyle}">AtoM Connection Settings</h2>
      <div style="${apiKeyDisplayStyle}">
        <p style="font-size: 16px;">Current API Key: <span style="${currentApiKeyStyle}" id="current-api-key">${localStorage.getItem('atom_api_key') || ''}</span></p>
      </div>
      <form onsubmit="${saveApiKey}">
        <div style="${formGroupStyle}">
          <label style="${labelStyle}" for="api-key">API Key:</label>
          <input style="${inputStyle}" type="text" id="api-key" name="api-key" oninput="${(event)=>{setApiKey(event.target.value)}}" placeholder="Enter a New API key" required>
        </div>
        <button style="${saveBtnStyle}" type="submit" class="save-btn">Save</button>
      </form>
    </div>
  `;
});