class RealNavbar extends HTMLElement {

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.active = this.getAttribute('active') || 'home';
    }

    connectedCallback() {
        this.render();
    }

    isActive = (name) => this.active === name ? 'active' : '';

    clickMenu = (evt) => {
        evt.preventDefault();
        console.log('real-navbar::clickMenu(): evt.target.href:', evt.target.href);

        const lastSlash = evt.target.href.lastIndexOf('/');
        console.log('real-navbar::clickMenu(): lastSlash:', lastSlash);

        const link = evt.target.href.slice(lastSlash + 1);
        console.log('real-navbar::clickMenu(): link:', link);

        this.setMenu(link);
    }

    setMenu(menu) {
        this.active = menu || 'home';
        this.render();
    }

    render() {
        console.log('navbar::render(): active:', this.active);

        this.shadow.innerHTML = `
            ${style()}
            
            <nav class="navbar navbar-light">
                <div class="container">
                    <a class="navbar-brand" href="/">conduit</a>
                    <ul class="nav navbar-nav pull-xs-right">
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('home')}" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('login')}" href="/login">Sign in</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${this.isActive('register')}" href="/register">Sign up</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;

        this.shadow
            .querySelectorAll('a')
            .forEach(aTag => aTag.addEventListener('click', this.clickMenu));
    }
}

customElements.define('real-navbar', RealNavbar);

function style() {
    console.log('real-navbar::style(): :');

    return`
        <style>
            a {
                text-decoration: none;
            }
            
            .navbar .container {
                margin-left: auto;
                margin-right: auto;
                padding-left: 15px;
                padding-right: 15px;
                
                display: flex;
                justify-content: space-between;
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
