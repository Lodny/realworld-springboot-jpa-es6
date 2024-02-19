class ProfilePage extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        this.pathName = this.getAttribute('pathName');
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
            ${style()}
            
            <h1>ProfilePage</h1>
            <h2>${this.pathName}</h2>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('profile-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('profile-page', ProfilePage);
export {ProfilePage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
                    
        </style>`;
}
