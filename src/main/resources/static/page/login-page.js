class LoginPage extends HTMLElement {
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
                <h1>Login</h1>
            </div>            
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('login-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('login-page', LoginPage);
export {LoginPage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
            h1 {
                color: blue;
            }
        </style>`;
}
