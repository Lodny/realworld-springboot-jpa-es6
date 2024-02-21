import {iconCdn} from "../services/icon-cdn.js";
import {apiGetProfile} from "../services/api.js";
import {store} from "../services/store.js";

const style = `<style>
        
</style>`;

const getTemplate = (article) => {
    const author = article.author;

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}

        <div class="article-page">
            <div class="banner">
                <div class="container">
                    <h1>${article.title}</h1>
        
                    <div class="article-meta">
                        <a href="/profile/${author.username}"><img src="${author.image}" /></a>
                        <div class="info">
                            <a href="/profile/eric-simons" class="author">Eric Simons</a>
                            <span class="date">January 20th</span>
                        </div>
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="ion-plus-round"></i>
                            &nbsp; Follow Eric Simons <span class="counter">(10)</span>
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="ion-heart"></i>
                            &nbsp; Favorite Post <span class="counter">(29)</span>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="ion-edit"></i> Edit Article
                        </button>
                        <button class="btn btn-sm btn-outline-danger">
                            <i class="ion-trash-a"></i> Delete Article
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

class ArticlePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const slug = this.getAttribute('pathName');
        console.log('article-page::constructor(): slug:', slug);
        const article = store.getArticle(slug);
        console.log('article-page::constructor(): article:', article);        
        this.shadowRoot.innerHTML = getTemplate(article);

        this.findElements();
        this.setEventHandler();
    }

    async connectedCallback() {
        // const data = await apiGetProfile(profileUsername);
        // this.profile = data.profile;
        // console.log('profile-page::connectedCallback(): this.profile:', this.profile);
        //
        // this.render(this.profile);
    }

    findElements() {
    }

    setEventHandler() {
        console.log('article-page::setEventHandler(): 1:', 1);

    }

    render() {
    }
}
customElements.define('article-page', ArticlePage);
export {ArticlePage}

