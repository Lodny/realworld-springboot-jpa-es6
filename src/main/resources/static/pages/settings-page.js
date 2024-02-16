class SettingsPage extends HTMLElement {
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
            
            <h1>SettingsPage</h1>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('settings-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('settings-page', SettingsPage);
export {SettingsPage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
        
        </style>`;
}
