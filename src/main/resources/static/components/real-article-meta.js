import {iconCdn} from "../services/icon-cdn.js";
import {currentUser, store} from "../services/store.js";

const style = `<style>

</style>`;

const getTemplate = (article, bLogin) => {
    const author = article.author;

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/article-meta.css">
        <link rel="stylesheet" href="../css/card.css">
        <link rel="stylesheet" href="../css/form.css">
        ${style}

        <div class="article-meta">
            <a href="/profile/${author.username}"><img src="${author.image}" /></a>
            <div class="info">
                <a href="/profile/${author.username}" class="author">${author.username}</a>
                <span class="date">${article.createdAt}</span>
            </div>
            
            <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-plus-round"></i>
                &nbsp; Follow ${author.username}
            </button>
            &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary">
                <i class="ion-heart"></i>
                &nbsp; Favorite Article <span class="counter">(${article.favoritesCount})</span>
            </button>
            ${bLogin ? `
            <button class="btn btn-sm btn-outline-secondary">
                <i class="ion-edit"></i> Edit Article
            </button>
            <button class="btn btn-sm btn-outline-danger">
                <i class="ion-trash-a"></i> Delete Article
            </button>`
            : ''}
        </div>        
    `;
}

class RealArticleMeta extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const slug = this.getAttribute('slug');
        console.log('real-comment-list::constructor(): slug:', slug);
        const article = store.getArticle(slug);
        console.log('real-article-meta::constructor(): article:', article);
        const user = currentUser();
        console.log('real-comment-list::constructor(): user:', user);
        this.shadowRoot.innerHTML = getTemplate(article, !!user);

        this.findElements();
        this.setEventHandler();
    }

    connectedCallback() {

    }

    findElements() {

    }

    setEventHandler() {

    }

    render() {

    }
}
customElements.define('real-article-meta', RealArticleMeta);
export {RealArticleMeta}
