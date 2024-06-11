class AtoMSearchInterface extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.criteria = [{ id: 0, query: '', field: '', operator: '' }];
    this.results = [];
    this.criterionIndex = 1;
    this.node = null;
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
      const url = `${window.location.protocol}//${window.location.hostname}/atom/search`;
      const token = await PydioApi._PydioRestClient.getOrUpdateJwt();
      const response = await fetch(`${url}${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const results = await response.json();
      this.results = results;
    } catch (error) {
      console.error('Error performing search:', error);
    }
    this.render();
  }

  handleResultClick(slug) {
    console.log('Result clicked:', slug);
    var propMap = [];
    if (!this.node) {
      throw new Error('No node set');
    }
    propMap.push({
      NodeUuid: this.node.Uuid,
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
    // Perform desired action with the slug, such as navigating to a different page or displaying more details
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
          cursor: pointer;
        }
        .result-item:hover {
          background-color: #e0e0e0;
        }
      </style>
      <div class="container">
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

        <div id="results" class="results">
          ${this.results.length === 0 ? `<p>No results found.</p>` : this.results.map(result => `
            <div class="result-item" data-slug="${result.slug}">
              <h4>${result.title}</h4>
              <p>${result.reference_code}</p>
              <button type="button" class="button" onclick="this.getRootNode().host.handleResultClick('${result.slug}')">Link to this result</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('atom-search-interface', AtoMSearchInterface);