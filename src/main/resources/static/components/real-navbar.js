import {store} from "../services/store.js";
import {iconCdn} from "../services/icon-cdn.js"
import {getRouteByName, getRouteByUrl} from "../services/routes.js";

class RealNavbar extends HTMLElement {

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.active = getRouteByUrl('/home');
    }

    connectedCallback() {
        this.render();
    }

    isActive = (name) => this.active?.name === name ? 'active' : '';
    setCallback = (cb) => this.callback = cb;

    clickLink = (evt) => {
        evt.preventDefault();
        console.log('real-navbar::clickLink(): evt.target.href:', evt.target.href);

        const link = getRouteByUrl(evt.target.href);
        console.log('real-navbar::clickLink(): link:', link);

        this.setCurrentLink(link);
    }

    setCurrentLink(link) {
        if (typeof link === 'string')
            link = getRouteByName(link);

        this.active = link;
        this.render();

        if (this.callback)
            this.callback(this.active);
    }

    get currMenu() {
        return this.active;
    }

    render() {
        console.log('navbar::render(): active:', this.active);

        this.user = store.get('user');
        console.log('real-navbar::render(): this.user:', this.user);
        const username = this.user?.username || 'Profile';
        console.log('real-navbar::render(): username:', username);

        this.shadow.innerHTML = `
            ${style()}
            
            <nav class="navbar navbar-light">
                <div class="container">
                    <a class="navbar-brand" href="/">conduit</a>
                    <ul class="nav navbar-nav pull-xs-right">
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('home')}" href="/">Home</a>
                        </li>
                    ${!this.user 
                    ? ` <li class="nav-item">
                            <a class="nav-link ${this.isActive('login')}" href="/login">Sign in</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('register')}" href="/register">Sign up</a>
                        </li>` 
                    : ` <li class="nav-item">
                            <a class="nav-link ${this.isActive('editor')}" href="/editor"><i class="ion-compose"></i> New Article</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('settings')}" href="/settings"><i class="ion-gear-a"></i> Settings</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('profile')}" href="/profile/${username}">
                                <img src="" class="user-pic" />${username}
                            </a>
                        </li>`
                    }
                    </ul>
                </div>
            </nav>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('real-navbar::setEventHandler(): 1:', 1);

        this.shadow
            .querySelectorAll('a')
            .forEach(aTag => aTag.addEventListener('click', this.clickLink));
    }
}
customElements.define('real-navbar', RealNavbar);

function style() {
    console.log('real-navbar::style(): :');

    return`
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">

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
}
