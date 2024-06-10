import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const AtoMSearchInterface = AirComponent('atom-search-interface', function() {
  const [criteria, setCriteria] = createState([{ id: 0, query: '', field: '', operator: '' }]);
  const [results, setResults] = createState([]);
  let criterionIndex = 1;

  const addCriterion = () => {
    setCriteria([...criteria, { id: criterionIndex, query: '', field: '', operator: 'and' }]);
    criterionIndex++;
  };

  const removeCriterion = (id) => {
    setCriteria(criteria.filter(criterion => criterion.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setCriteria(criteria.map(criterion => criterion.id === id ? { ...criterion, [field]: value } : criterion));
  };

  const performSearch = async () => {
    const params = new URLSearchParams();
    criteria.forEach((criterion, index) => {
      if (index > 0) {
        params.append(`so${index}`, criterion.operator);
      }
      params.append(`sq${index}`, criterion.query);
      params.append(`sf${index}`, criterion.field);
    });
    // ensure that all descriptions are included in the search, not just top-level descriptions, by setting topLod to 0
    params.append('topLod', 0);
    try {
      const response = await fetch(`/informationobject/browse?${params.toString()}`);
      const results = await response.json();
      setResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const containerStyle = airCss({
    maxWidth: '60%',
    margin: '20px auto',
    padding: '20px',
    borderRadius: '8px',
  });

  const headerStyle = airCss({
    fontSize: '24px',
    color: '#333333',
    marginBottom: '20px',
  });

  const criterionStyle = airCss({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  });

  const inputStyle = airCss({
    flex: '1',
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  });

  const selectStyle = airCss({
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  });

  const buttonStyle = airCss({
    margin: '5px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    cursor: 'pointer',
  });

  const removeButtonStyle = airCss({
    margin: '5px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#dc3545',
    color: '#ffffff',
    cursor: 'pointer',
  });

  const resultsStyle = airCss({
    marginTop: '20px',
  });

  const resultItemStyle = airCss({
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
  });

  return () => html`
    <div style="${containerStyle}">
      <h2 style="${headerStyle}">Advanced Search</h2>
      <div id="criteriaContainer">
        ${criteria.map((criterion, index) => html`
          <div style="${criterionStyle}">
            ${index > 0 ? html`
              <select class="form-select" style="${selectStyle}" value="${criterion.operator}" onchange="${e => handleInputChange(criterion.id, 'operator', e.target.value)}">
                <option value="and">and</option>
                <option value="or">or</option>
                <option value="not">not</option>
              </select>
            ` : ''}
            <input type="text" class="form-control" style="${inputStyle}" value="${criterion.query}" placeholder="Search query" onchange="${e => handleInputChange(criterion.id, 'query', e.target.value)}">
            <select class="form-select" style="${selectStyle}" value="${criterion.field}" onchange="${e => handleInputChange(criterion.id, 'field', e.target.value)}">
              <option value="">Any field</option>
              <option value="title">Title</option>
              <option value="archivalHistory">Archival history</option>
              <option value="scopeAndContent">Scope and content</option>
              <option value="extentAndMedium">Extent and medium</option>
              <option value="subject">Subject access points</option>
              <option value="name">Name access points</option>
              <option value="place">Place access points</option>
              <option value="genre">Genre access points</option>
              <option value="identifier">Identifier</option>
              <option value="referenceCode">Reference code</option>
              <option value="digitalObjectTranscript">Digital object text</option>
              <option value="creator">Creator</option>
              <option value="findingAidTranscript">Finding aid text</option>
              <option value="allExceptFindingAidTranscript">Any field except finding aid text</option>
            </select>
            <button type="button" style="${criterion.id === 0 ? "display:none;" : ""}${removeButtonStyle}" onclick="${() => removeCriterion(criterion.id)}">Remove</button>
          </div>
        `)}
      </div>
      <button type="button" style="${buttonStyle}" onclick="${addCriterion}">Add Another Criterion</button>
      <button type="button" style="${buttonStyle}" onclick="${performSearch}">Search</button>

      <div id="results" style="${resultsStyle}">
        ${results.length === 0 ? html`<p>No results found.</p>` : results.map(result => html`
          <div style="${resultItemStyle}">
            <h4>${result.title}</h4>
            <p>${result.reference_code}</p>
          </div>
        `)}
      </div>
    </div>
  `;
});
