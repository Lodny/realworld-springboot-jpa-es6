import {store} from "../services/store.js";
import {iconCdn} from "../services/icon-cdn.js"
import {getRouteByName, getRouteByUrl} from "../services/routes.js";

const style = `
    <style>
        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: end;
        }
        
        .navbar .navbar-brand {
            position: relative;
            padding: 0.5rem 1rem;
            
            font-family: "Titillium Web", sans-serif;
            font-size: 1.5rem;
            float: left;
            /*padding-top: 0;*/
            /*padding-bottom: 0.25rem;*/
            margin-right: 2rem;
            color: #5CB85C;
        }
        
        .navbar ul {
            display: flex;
        }
        
        .navbar ul li {
            list-style: none;
            padding: 0 1rem;
            /*margin-right: 1rem;                            */
        }
        
        .navbar ul li a {
            color: rgba(0, 0, 0, 0.3);
        }
        
        .navbar ul li a.active {
            color: rgba(0, 0, 0, 0.8);
        }
        
        .navbar ul li a:hover {
            color: rgba(0, 0, 0, 0.8);
        }            
    </style>`;

const getTemplate = (user) => {
    const username = user?.username || 'Profile';
    console.log('real-navbar::getTemplate(): user:', user);

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
            
        <nav class="navbar navbar-light">
            <div class="container">
                <a class="navbar-brand" href="/">conduit</a>
                <ul class="nav navbar-nav pull-xs-right">
                    <li class="nav-item">
                        <a class="nav-link active" href="/">Home</a>
                    </li>
                    ${!user
                ? ` <li class="nav-item">
                        <a class="nav-link" href="/login">Sign in</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/register">Sign up</a>
                    </li>`
                : ` <li class="nav-item">
                        <a class="nav-link" href="/editor"><i class="ion-compose"></i> New Article</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/settings"><i class="ion-gear-a"></i> Settings</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/profile/${username}">
                            <img src="" class="user-pic" />${username}
                        </a>
                    </li>`
                    }
                </ul>
            </div>
        </nav>
    `;
}

class RealNavbar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.user = store.get('user');
        console.log('real-navbar::render(): this.user:', this.user);
        this.shadowRoot.innerHTML = getTemplate(this.user);

        this.findElement();
        this.setEventHandler();

        console.log('real-navbar::constructor(): this.links:', this.links);

        this.active = getRouteByUrl('/');
        console.log('real-navbar::constructor(): this.active:', this.active);
    }

    connectedCallback() {
        this.updateActiveLink(null, this.active);
    }

    findElement = () => this.links = Array.from(this.shadowRoot.querySelectorAll('.nav-link'));

    setEventHandler = () => this.links.forEach(aTag => aTag.addEventListener('click', this.clickLink));

    setCallback = (cb) => this.callback = cb;

    clickLink = (evt) => {
        evt.preventDefault();
        console.log('real-navbar::clickLink(): evt.target.href:', evt.target.href);

        const route = getRouteByUrl(evt.target.href);
        console.log('real-navbar::clickLink(): route:', route);

        this.setCurrentLink(route);
    }

    setCurrentLink(link) {
        if (typeof link === 'string')
            link = getRouteByName(link);

        const prevActive = this.active;
        this.active = link;
        this.updateActiveLink(prevActive, this.active);

        if (this.callback)
            this.callback(this.active);
    }

    // get currMenu() {
    //     return this.active;
    // }

    updateActiveLink(prevActive, currActive) {
        console.log('real-navbar::updateActiveLink(): prevActive:', prevActive);
        console.log('real-navbar::updateActiveLink(): currActive:', currActive);

        this.links
            .find(link => getRouteByUrl(link.href)?.name === prevActive.name)
            ?.classList.remove('active');

        this.links
            .find(link => getRouteByUrl(link.href)?.name === currActive.name)
            ?.classList.add('active');
    }
}
customElements.define('real-navbar', RealNavbar);

