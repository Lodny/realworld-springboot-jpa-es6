import {RealArticlePreview} from "./real-article-preview.js";
import {RealPaging} from "./real-paging.js";
import {currentUser, store} from "../services/store.js";
import {getGlobalArticles} from "../services/api.js";
import {iconCdn} from "../services/icon-cdn.js";

const style = ` <style>
    .feed-toggle {
        margin-bottom: -1px;
    }

    .nav {
        padding-left: 0;
        margin-bottom: 0;
        list-style: none
    }
    
    .nav-link {
        display: inline-block
    }
    
    .nav-link:focus, .nav-link:hover {
        text-decoration: none
    }
    
    .nav-link.disabled {
        color: #818a91
    }
    
    .nav-pills::after {
        content: "";
        display: table;
        clear: both
    }
    
    .nav-pills .nav-item {
        float: left
    }
    
    .nav-pills .nav-item + .nav-item {
        margin-left: .2rem
    }
    
    .nav-pills .nav-link {
        display: block;
        padding: .5em 1em;
        border-radius: .25rem
    }

    .nav-pills.outline-active .nav-link {
        border-radius: 0;
        border: none;
        border-bottom: 2px solid transparent;
        background: 0 0;
        color: #aaa
    }
    
    .nav-pills.outline-active .nav-link:hover {
        color: #555
    }
    
    .nav-pills.outline-active .nav-link.active {
        background: #fff !important;
        border-bottom: 2px solid #5cb85c !important;
        color: #5cb85c !important
    }
</style>`;

const getTemplate = () => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
        
        <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
                <li class="nav-item global">
                    <a class="nav-link active" href="Global Feed">Global Feed</a>
                </li>
            </ul>
        </div>
        <slot></slot>
    `;
}

class RealTab extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = getTemplate();

        this.tabTitles = this.getAttribute('tab-titles').split(',');
        this.activeTab = this.getAttribute('active-tab');
        console.log('real-tab::constructor(): this.tabTitles:', this.tabTitles);
        console.log('real-tab::constructor(): this.activeTab:', this.activeTab);

        this.findElements();
        this.setEventHandler();
    }

    async connectedCallback() {
        this.updateTabs(this.tabTitles, this.activeTab);
        this.render();
    }

    static get observedAttributes() {
        return ['tab-titles', 'active-tab'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('real-tab::attributeChangedCallback(): name, oldValue, newValue:', name, oldValue, newValue);
        // if (oldValue === newValue) {
        //     return;
        // }

        if ('tab-titles' === name) {
            const tabTitles = newValue.split(',');
            this.updateTabs(tabTitles, this.activeTab);
            this.tabTitles = tabTitles;
        }
        else if ('active-tab' === name) {
            this.updateActiveTab(oldValue, newValue);
            this.activeTab = newValue;

            if (this.callback)
                this.callback(this.activeTab);
        }
    }

    findElements() {
        this.tabUlTag = this.shadowRoot.querySelector('ul');
        this.links = this.shadowRoot.querySelectorAll('a');
    }

    setEventHandler() {
        console.log('real-tab::setEventHandler(): 1:', 1);
        this.links.forEach(aTag => aTag.addEventListener('click', this.clickLink));
    }

    setCallback = (cb) => this.callback = cb;

    clickLink = async (evt) => {
        evt.preventDefault();
        console.log('real-tab::clickLink(): evt.target:', evt.target);

        this.setActiveTab(evt.target.innerHTML);
    }

    setActiveTab(tabTitle) {
        console.log('real-tab::setActiveTab(): tabTitle:', tabTitle);
        // if (this.activeTab === tabTitle) return;
        this.setAttribute('active-tab', tabTitle);
    }

    render() {
        // this.updateTabs();
    }

    updateTabs(tabTitles, activeTab) {
        console.log('real-tab::updateTabs(): tabTitles, activeTab:', tabTitles, activeTab);
        this.tabUlTag.innerHTML = tabTitles.map(title =>`
            <li class="nav-item">
                <a class="nav-link ${title === activeTab ? 'active' : ''}" href="${title}">${title}</a>
            </li>`).join('');

        this.findElements()
        this.setEventHandler();
    }

    updateActiveTab(oldActiveTab, activeTab) {
        let linkTag = this.shadowRoot.querySelector('.nav-link.active');
        linkTag?.classList.remove('active');

        linkTag = this.shadowRoot.querySelector(`a[href="${activeTab}"]`);
        console.log('real-tab::updateActiveTab(): linkTag:', linkTag);

        linkTag?.classList.add('active');
    }
}
customElements.define('real-tab', RealTab);
export {RealTab}

