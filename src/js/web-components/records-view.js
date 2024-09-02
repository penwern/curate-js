import { AirComponent, html, state, createQuery } from "@air-apps/air-js";


document.addEventListener("DOMContentLoaded", () => {
    console.log('Loading records-view.js');
    AirComponent("records-view", props => {
        
        return html`
            <div class="records-view">
                <h1>Records View</h1>
            </div>
        `;
    })
});