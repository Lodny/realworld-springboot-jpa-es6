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
            
            <div>
                <h1>Home</h1>
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
    return `<style>
        h1 {
            color: blue;
        }
    </style>`;
}
