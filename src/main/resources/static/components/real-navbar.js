import {currentUser} from "../services/store.js";
import {iconCdn} from "../services/icon-cdn.js"
import {getRouteByUrl} from "../services/routes.js";

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

const getTemplate = () => {
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
                    <li class="nav-item off">
                        <a class="nav-link" href="/login">Sign in</a>
                    </li>
                    <li class="nav-item off">
                        <a class="nav-link" href="/register">Sign up</a>
                    </li>
                    <li class="nav-item on" style="display: none">
                        <a class="nav-link" href="/editor"><i class="ion-compose"></i> New Article</a>
                    </li>
                    <li class="nav-item on" style="display: none">
                        <a class="nav-link" href="/settings"><i class="ion-gear-a"></i> Settings</a>
                    </li>
                    <li class="nav-item on" style="display: none">
                        <a class="nav-link username" href="/profile/username">
                            <img src="" class="user-pic" />username
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
}

class RealNavbar extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = getTemplate();

        this.findElements();
        this.setEventHandler();

        this.active = getRouteByUrl('/');
        console.log('real-navbar::constructor(): this.active:', this.active);
    }

    connectedCallback() {
        this.render(null, this.active);
    }

    findElements = () => {
        this.links = Array.from(this.shadowRoot.querySelectorAll('a'));
        this.offLis = Array.from(this.shadowRoot.querySelectorAll('.nav-item.off'));
        this.onLis = Array.from(this.shadowRoot.querySelectorAll('.nav-item.on'));
        this.usernameLink = this.shadowRoot.querySelector('.nav-link.username');
    }

    setEventHandler = () => {
        this.links.forEach(aTag => aTag.addEventListener('click', this.clickLink));
    }

    setCallback = (cb) => this.callback = cb;

    clickLink = (evt) => {
        evt.preventDefault();
        console.log('real-navbar::clickLink(): evt.target.href:', evt.target.href);

        this.setCurrentLink(evt.target.href);
    }

    setCurrentLink(link) {
        if (typeof link === 'string')
            link = getRouteByUrl(link);

        const prevActive = this.active;
        this.active = link;
        this.render(prevActive, this.active);

        if (this.callback)
            this.callback(this.active);
    }

    render(prevActive, currActive) {
        this.updateLinks();
        this.updateActiveLink(prevActive, currActive);
    }

    updateLinks() {
        const user = currentUser();
        console.log('real-navbar::updateLinks(): user:', user);

        this.offLis.forEach(link => link.style.display = user ? 'none' : 'block');
        this.onLis.forEach(link => link.style.display = user ? 'block' : 'none');

        if (user) {
            this.usernameLink.innerHTML = `<img src="" class="user-pic"/>${user.username}`;
            this.usernameLink.href = `href="/profile/${user.username}`
        }
    }

    updateActiveLink(prevActive, currActive) {
        console.log('real-navbar::updateActiveLink(): prevActive:', prevActive);
        console.log('real-navbar::updateActiveLink(): currActive:', currActive);

        this.links.toReversed()
            .find(link => getRouteByUrl(link.href)?.name === prevActive?.name)
            ?.classList.remove('active');

        this.links.toReversed()
            .find(link => getRouteByUrl(link.href)?.name === currActive.name)
            ?.classList.add('active');
    }
}
customElements.define('real-navbar', RealNavbar);

