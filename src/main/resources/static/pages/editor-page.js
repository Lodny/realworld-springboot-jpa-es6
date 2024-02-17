class EditorPage extends HTMLElement {
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
            
            <h1>NewArticlePage</h1>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('new-article-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('new-article-page', EditorPage);
export {EditorPage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
            .editor-page .tag-list i {
                font-size: .6rem;
                margin-right: 5px;
                cursor: pointer
            }        
        </style>`;
}
