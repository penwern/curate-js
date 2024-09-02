import { AirComponent, html, state, createQuery } from "@air-apps/air-js";


window.addEventListener("load", () => {
    console.log('Loading records-view.js');
    AirComponent("records-view", props => {
        
        return html`
            <div class="records-view">
                <h1>Records View</h1>
            </div>
        `;
    })
});