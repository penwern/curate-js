import { AirComponent, html, state, createQuery } from "@air-apps/air-js";

const rf = async (nodePaths, limit, offset) => {
    const response = fetch(`/api/a/tree/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          NodePaths: nodePaths,
          Limit: limit,
          Offset: offset,
          AllMetaProviders: true,
        }),
    });
      
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
      
    return response.json();
}



const RecordsView = AirComponent("records-view", props => {
    const { isLoading, error, data } = createQuery('records', rf(['appraisal/*'], 10, 0));
    return html`
        <div class="records-view">
            <h1>Records View</h1>
            ${isLoading ? html`<div>Loading...</div>` : null}
            ${error ? html`<div>Error: ${error}</div>` : null}
            ${data ? html`<div>Data: ${JSON.stringify(data)}</div>` : null}
        </div>
    `;
})