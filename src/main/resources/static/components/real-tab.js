import {RealArticle} from "./real-article.js";
import {RealPaging} from "./real-paging.js";
import {store} from "../services/store.js";

class RealTab extends HTMLElement {

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.active = this.getAttribute('active') || 'home';
    }

    connectedCallback() {
        this.render();
    }

    isActive = (name) => this.active === name ? 'active' : '';
    setCallback = (cb) => this.callback = cb;

    clickLink = (evt) => {
        evt.preventDefault();
        console.log('real-tab::clickLink(): evt.target.href:', evt.target.href);

        const lastSlash = evt.target.href.lastIndexOf('/');
        console.log('real-tab::clickLink(): lastSlash:', lastSlash);

        const link = evt.target.href.slice(lastSlash + 1);
        console.log('real-tab::clickLink(): link:', link);

        this.setCurrentLink(link);
    }

    setCurrentLink(link) {
        this.active = link || 'home';
        this.render();

        if (this.callback)
            this.callback(this.active);
    }

    get currMenu() {
        return this.active;
    }

    render() {
        console.log('tab::render(): active:', this.active);

        this.user = store.get('user');
        console.log('real-tab::render(): this.user:', this.user);
        const username = this.user?.username || 'Profile';
        console.log('real-tab::render(): username:', username);

        this.shadow.innerHTML = `
            ${style()}
            
            <div class="feed-toggle">
                <ul class="nav nav-pills outline-active">
                    <li class="nav-item">
                        <a class="nav-link" href="">Your Feed</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="">Global Feed</a>
                    </li>
                </ul>
            </div>

            <real-article></real-article>
            <real-paging></real-paging>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('real-tab::setEventHandler(): 1:', 1);

        this.shadow
            .querySelectorAll('a')
            .forEach(aTag => aTag.addEventListener('click', this.clickLink));
    }
}
customElements.define('real-tab', RealTab);
export {RealTab}

function style() {
    console.log('real-navbar::style(): :');

    return`
        <link rel="stylesheet" href="../css/common.css">

        <style>
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
}
