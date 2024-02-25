import {iconCdn} from "../services/icon-cdn.js";
import {actionQueue} from "../services/action-queue.js";

const style = `<style>
    .sidebar {
        padding: 5px 10px 10px;
        background: #f3f3f3;
        border-radius: 4px
    }
    
    .sidebar p {
        margin-bottom: .2rem
    }            
</style>`;

const getTemplate = () => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/tag.css">
        ${style}
        
        <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
<!--                <a href="" class="tag-pill tag-default">programming</a>-->
            </div>
        </div>    
    `;
}

class RealSidebar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = getTemplate();
    }

    async connectedCallback() {
        actionQueue.addAction({
            type: 'tags',
            callback: this.callback
        });

        this.findElements();
    }

    findElements() {
        this.tagListTag = this.shadowRoot.querySelector('.tag-list');
    }

    setEventHandler() {
        this.shadowRoot
            .querySelectorAll('a')
            .forEach(link => link.addEventListener('click', this.clickTag))
    }

    clickTag = (evt) => {
        evt.preventDefault();
        console.log('real-sidebar::clickTag(): evt.target:', evt.target);
        console.log('real-sidebar::clickTag(): evt.target.innerHTML:', evt.target.innerHTML);

        this?.callback(evt.target.innerHTML);
    }

    setCallback = callback => this.callback = callback;

    callback = ({type, result: tags}) => {
        console.log('real-sidebar::connectedCallback(): tags:', tags);

        this.updateTags(tags);
        this.setEventHandler();
    }

    render() {
    }

    updateTags(tags) {
        this.tagListTag.innerHTML = tags
            .map(tag => `<a href="" class="tag-pill tag-default">${tag}</a>`)
            .join('');
    }
}
customElements.define('real-sidebar', RealSidebar);
export {RealSidebar}

