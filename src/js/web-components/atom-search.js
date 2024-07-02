class AtoMSearchInterface extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.criteria = [{ id: 0, query: '', field: '', operator: '' }];
    this.results = [];
    this.criterionIndex = 1;
    this.node = null;
    this.error = null;
    this.isLoading = false;
    this.render();
  }
  setNode(node) {
    this.node = node;
    this.render();
  }
  addCriterion() {
    this.criteria.push({ id: this.criterionIndex, query: '', field: '', operator: 'and' });
    this.criterionIndex++;
    this.render();
  }

  removeCriterion(id) {
    this.criteria = this.criteria.filter(criterion => criterion.id !== id);
    this.render();
  }

  handleInputChange(id, field, value) {
    this.criteria = this.criteria.map(criterion => criterion.id === id ? { ...criterion, [field]: value } : criterion);
    this.render();
  }

  async performSearch() {
    this.isLoading = true;
    this.error = null;
    this.render();

    const params = new URLSearchParams();
    this.criteria.forEach((criterion, index) => {
      if (index > 0) {
        params.append(`so${index}`, criterion.operator);
      }
      params.append(`sq${index}`, criterion.query);
      params.append(`sf${index}`, criterion.field);
    });
    params.append('topLod', 0);
    try {
      const url = `${window.location.protocol}//${window.location.hostname}:6900/atom/search`;
      const token = await PydioApi._PydioRestClient.getOrUpdateJwt();
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const results = await response.json();
      console.log("retrieve results: ", results);
      this.results = results.results;
    } catch (error) {
      console.error('Error performing search:', error);
      this.error = `An error occurred while searching: ${error.message}`;
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  handleResultClick(slug) {
    console.log('Result clicked:', slug);
    var propMap = [];
    if (!this.node) {
      throw new Error('No node set');
    }
    console.log("node to link to:", this.node);
    propMap.push({
      NodeUuid: this.node._metadata.get('uuid'),
      JsonValue: JSON.stringify(slug),
      Namespace: "usermeta-atom-linked-description",
      Policies: [
        {
          "Action": "READ",
          "Effect": "allow",
          "Subject": "*"
        },
        {
          "Action": "WRITE",
          "Effect": "allow",
          "Subject": "*"
        }
      ]
    });
    Curate.api.fetchCurate("/a/user-meta/update", "PUT", { MetaDatas: propMap, Operation: "PUT" });
    this.dispatchEvent(new CustomEvent('description-linked', { detail: slug }));
    this.remove()
  }
  toggleAccordion(header) {
    header.classList.toggle('collapsed');
    const body = header.nextElementSibling;
    const icon = header.querySelector('.chevron'); // Assuming the icon has class 'chevron'
    
    if (body.classList.contains('show')) {
        body.classList.remove('show');
        icon.classList.remove('down'); // Rotate the icon to the default rightwards position
        localStorage.setItem('accordionState', 'true');
    } else {
        body.classList.add('show');
        icon.classList.add('down'); // Rotate the icon to face downwards
        localStorage.setItem('accordionState', 'false');
    }
  }


  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          margin: 20px auto;
          padding: 20px;
          border-radius: 8px;
        }
        .header {
          font-size: 24px;
          color: #333333;
          margin-bottom: 20px;
        }
        .chevron {
          transition: transform 0.3s ease;
        }
        .chevron.down {
            transform: rotate(90deg);
        }
        .criterion {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
        }
        .select {
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
        }
        .button {
          margin: 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #ffffff;
          cursor: pointer;
        }
        .remove-button {
          margin: 5px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #dc3545;
          color: #ffffff;
          cursor: pointer;
        }
        .results {
          margin-top: 20px;
        }
        .result-item {
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: #f9f9f9;
          margin-bottom: 10px;
        }
        .glass {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          padding: 20px;
          color: #333;
          min-width: 60vw;
          margin-bottom: 2em;
          text-align: left;
          max-height: 25em;
          overflow-y: scroll;
        }
        .info {
            margin-bottom: 2em;
        }
        .accordion {
          margin: 10px 0;
        }
        .accordion-header {
          cursor: pointer;
          padding: 10px;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 5px;
          display: flex;
          align-items: center;
        }
        .accordion-body {
          padding: 10px;
          border: 1px solid #ddd;
          border-top: none;
          display: none;
        }
        .accordion-body.show {
          display: block;
        }
        .accordion-header i {
          margin-right: 10px;
        }
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50px;
        }

        .loading::after {
          content: "";
          width: 30px;
          height: 30px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <div class="accordion">
        <div class="accordion-header collapsed" onclick="this.getRootNode().host.toggleAccordion(this)">  
          Warning: Click to succ deez nutz view essential information
          <div class="chevron" style="width: 24px; height: 24px; display: inline-block; vertical-align: middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
          </div>
        </div>
        <div class="accordion-body ${localStorage.getItem('accordionState') === 'true' ? '' : 'show'}">
          <div class="info">
            <p>This interface allows you to search for descriptions in your AtoM instance using a set of search criteria.</p>
            <p>You can add as many search criteria as you like, and then perform a search to find descriptions that match your criteria.</p>
            <p>Once you have found a description, you can link it to your selected node in Curate.</p>
            <p>Please note: only the top-level linked description will be considered when associating your dissemination package with AtoM.</p>
            <p>For example, if you create an AIP from a folder containing multiple files, only the folder itself will be checked for a linked description.</p>
            <p>AtoM automatically links the sub-files or folders as child level descendants of the top-level linked description.</p>
          </div>
        </div>
      </div>
        <div class="glass">
          <div id="criteriaContainer">
            ${this.criteria.map((criterion, index) => `
              <div class="criterion">
                ${index > 0 ? `
                  <select class="select" value="${criterion.operator}" onchange="this.getRootNode().host.handleInputChange(${criterion.id}, 'operator', this.value)">
                    <option value="and" ${criterion.operator === 'and' ? 'selected' : ''}>and</option>
                    <option value="or" ${criterion.operator === 'or' ? 'selected' : ''}>or</option>
                    <option value="not" ${criterion.operator === 'not' ? 'selected' : ''}>not</option>
                  </select>
                ` : ''}
                <input type="text" class="input" value="${criterion.query}" placeholder="Search query" onchange="this.getRootNode().host.handleInputChange(${criterion.id}, 'query', this.value)">
                <select class="select" value="${criterion.field}" onchange="this.getRootNode().host.handleInputChange(${criterion.id}, 'field', this.value)">
                  <option value="">Any field</option>
                  <option value="title" ${criterion.field === 'title' ? 'selected' : ''}>Title</option>
                  <option value="archivalHistory" ${criterion.field === 'archivalHistory' ? 'selected' : ''}>Archival history</option>
                  <option value="scopeAndContent" ${criterion.field === 'scopeAndContent' ? 'selected' : ''}>Scope and content</option>
                  <option value="extentAndMedium" ${criterion.field === 'extentAndMedium' ? 'selected' : ''}>Extent and medium</option>
                  <option value="subject" ${criterion.field === 'subject' ? 'selected' : ''}>Subject access points</option>
                  <option value="name" ${criterion.field === 'name' ? 'selected' : ''}>Name access points</option>
                  <option value="place" ${criterion.field === 'place' ? 'selected' : ''}>Place access points</option>
                  <option value="genre" ${criterion.field === 'genre' ? 'selected' : ''}>Genre access points</option>
                  <option value="identifier" ${criterion.field === 'identifier' ? 'selected' : ''}>Identifier</option>
                  <option value="referenceCode" ${criterion.field === 'referenceCode' ? 'selected' : ''}>Reference code</option>
                  <option value="digitalObjectTranscript" ${criterion.field === 'digitalObjectTranscript' ? 'selected' : ''}>Digital object text</option>
                  <option value="creator" ${criterion.field === 'creator' ? 'selected' : ''}>Creator</option>
                  <option value="findingAidTranscript" ${criterion.field === 'findingAidTranscript' ? 'selected' : ''}>Finding aid text</option>
                  <option value="allExceptFindingAidTranscript" ${criterion.field === 'allExceptFindingAidTranscript' ? 'selected' : ''}>Any field except finding aid text</option>
                </select>
                <button type="button" class="remove-button" style="${criterion.id === 0 ? 'display:none;' : ''}" onclick="this.getRootNode().host.removeCriterion(${criterion.id})">Remove</button>
              </div>
            `).join('')}
          </div>
          <button type="button" class="button" onclick="this.getRootNode().host.addCriterion()">Add Another Criterion</button>
          <button type="button" class="button" onclick="this.getRootNode().host.performSearch()">Search</button>

          ${this.isLoading ? '<div class="loading"></div>' : ''}
        
          ${this.error ? `<div class="error-message">${this.error}</div>` : ''}

          <div id="results" class="results">
            ${this.results.length === 0 && !this.isLoading && !this.error ? 
              `<p>No results found. Please try a different search.</p>` : 
              this.results.map(result => `
                <div class="result-item" data-slug="${result.slug}">
                  <h4>${result.title}</h4>
                  <p>${result.reference_code}</p>
                  <button type="button" class="button" onclick="this.getRootNode().host.handleResultClick('${result.slug}')">Link to this result</button>
                </div>
              `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('atom-search-interface', AtoMSearchInterface);