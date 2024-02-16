class RegisterPage extends HTMLElement {
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
                <h1>Register</h1>
            </div>            
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('register-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('register-page', RegisterPage);
export {RegisterPage}

function style() {
    return `<style>
        h1 {
            color: blue;
        }
    </style>`;
}
