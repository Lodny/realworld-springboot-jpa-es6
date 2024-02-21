import {iconCdn} from "../services/icon-cdn.js";

const style = `<style>
    .sidebar {
        padding: 5px 10px 10px;
        background: #f3f3f3;
        border-radius: 4px
    }
    
    .sidebar p {
        margin-bottom: .2rem
    }            
    
   .tag-pill {
        padding-right: .6em;
        padding-left: .6em;
        border-radius: 10rem
    }
    
    .tag-default[href]:focus, .tag-default[href]:hover {
        background-color: #687077
    }
    
    .tag-default {
        color: #fff !important;
        background-color: #818a91;
        font-size: .8rem;
        padding-top: .1rem;
        padding-bottom: .1rem;
        white-space: nowrap;
        margin-right: 3px;
        margin-bottom: .2rem;
        display: inline-block
    }
    
    .tag-default:hover {
        text-decoration: none
    }
</style>`;

const getTemplate = () => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
        
        <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
                <a href="" class="tag-pill tag-default">programming</a>
                <a href="" class="tag-pill tag-default">javascript</a>
                <a href="" class="tag-pill tag-default">emberjs</a>
                <a href="" class="tag-pill tag-default">angularjs</a>
                <a href="" class="tag-pill tag-default">reactjs</a>
                <a href="" class="tag-pill tag-default">mean</a>
                <a href="" class="tag-pill tag-default">node</a>
                <a href="" class="tag-pill tag-default">rails</a>
            </div>
        </div>    
    `;
}

class RealSidebar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = getTemplate();

        this.findElements();
        this.setEventHandler();
    }

    connectedCallback() {
        this.render();
    }

    findElements() {
        this.links = this.shadowRoot.querySelectorAll('a');
    }

    setEventHandler() {
        this.links.forEach(link => link.addEventListener('click', this.clickTag))
    }

    clickTag = (evt) => {
        evt.preventDefault();
        console.log('real-sidebar::clickTag(): evt.target:', evt.target);
        console.log('real-sidebar::clickTag(): evt.target.innerHTML:', evt.target.innerHTML);

        this?.callback(evt.target.innerHTML);
    }

    setCallback = callback => this.callback = callback;

    render() {
    }
}
customElements.define('real-sidebar', RealSidebar);
export {RealSidebar}

