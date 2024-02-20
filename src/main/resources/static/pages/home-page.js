import {RealBanner} from '../components/real-banner.js'
import {RealTab} from '../components/real-tab.js'
import {RealSidebar} from '../components/real-sidebar.js'

class HomePage extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
            ${style()}
            
            <div class="home-page">
                <real-banner></real-banner>            
            
                <div class="container page">
                    <div class="row">
                        <real-tab class="col-md-9"></real-tab>
                        <real-sidebar class="col-md-3"></real-sidebar>
                    </div>
                </div>
            </div>            
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('home-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('home-page', HomePage);
export {HomePage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">
        
        <style>
            .container.page {
                margin-top: 1.5rem;
            }
        </style>`;
}
