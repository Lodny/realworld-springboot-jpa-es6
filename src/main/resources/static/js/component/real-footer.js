class RealFooter extends HTMLElement {

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
            
            <footer>
                <div class="container">
                    <a href="/" class="logo-font">conduit</a>
                    <span class="attribution">
                          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp;
                          design licensed under MIT.
                    </span>
                </div>
            </footer>
        `
    }
}

customElements.define('real-footer', RealFooter);

function style() {
    return `<style>
        a {
            text-decoration: none;
            color: #5CB85C;
        }

        footer {
            position: absolute;
            
            font-family: "Titillium Web", sans-serif;
            bottom: 0;
            width: 100%;
            background-color: #F3F3F3;
            
            margin-top: 2rem;
        }
        
        .container {
            line-height: 1.5rem;
            padding: 1rem 5rem;
            
            display: flex;
        }
        
        .logo-font {
            font-size: 1rem;
        }
        
        .attribution {
            color: #aaa;
            font-size: 0.7rem;
            font-weight: lighter;
            margin-left: 1rem;
        }
        
                
    </style>`;
}
