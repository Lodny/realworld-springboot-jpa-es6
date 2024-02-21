import {iconCdn} from "../services/icon-cdn.js";
import {currentUser, store} from "../services/store.js";
import {addGoAction} from "../services/action-queue.js";

const getStyle = (color) => {
    return `<style>
        a {
            color: ${color};
        }
        
        .article-meta .info {
            text-align: left
        }
    </style>`;
}

const getTemplate = (article, isMyArticle, color) => {
    const author = article.author;

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/article-meta.css">
        <link rel="stylesheet" href="../css/card.css">
        <link rel="stylesheet" href="../css/form.css">
        ${getStyle(color)}

        <div class="article-meta">
            <a href="/profile/${author.username}"><img src="${author.image}" /></a>
            <div class="info">
                <a href="/profile/${author.username}" class="author">${author.username}</a>
                <span class="date">${article.createdAt}</span>
            </div>
            
            ${isMyArticle ? `
            <button class="btn btn-sm btn-outline-secondary edit">
                <i class="ion-edit"></i> Edit Article
            </button>
            <button class="btn btn-sm btn-outline-danger delete">
                <i class="ion-trash-a"></i> Delete Article
            </button>`
            : `
            <button class="btn btn-sm btn-outline-secondary follow">
                <i class="ion-plus-round"></i>
                Follow ${author.username}
            </button>
            <button class="btn btn-sm btn-outline-primary favorite">
                <i class="ion-heart"></i>
                Favorite Article <span class="counter">(${article.favoritesCount})</span>
            </button>
            `}
        </div>        
    `;
}

class RealArticleMeta extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.slug = this.getAttribute('slug');
        console.log('real-comment-list::constructor(): slug:', this.slug);
        const article = store.getArticle(this.slug);
        console.log('real-article-meta::constructor(): article:', article);

        const user = currentUser();
        console.log('real-comment-list::constructor(): user:', user);
        const isMyArticle = user && user.username === article.author.username;
        console.log('real-article-meta::constructor(): isMyArticle:', isMyArticle);

        const color = this.getAttribute('color');
        console.log('real-article-meta::constructor(): color:', color);

        this.shadowRoot.innerHTML = getTemplate(article, isMyArticle, color);

        this.findElements();
        this.setEventHandler();
    }

    connectedCallback() {

    }

    findElements() {
        this.editBtn = this.shadowRoot.querySelector('button.edit');
        this.deleteBtn = this.shadowRoot.querySelector('button.delete');
        this.followBtn = this.shadowRoot.querySelector('button.follow');
        this.favoriteBtn = this.shadowRoot.querySelector('button.favorite');

        console.log('real-article-meta::findElements(): this.editBtn:', this.editBtn);
        console.log('real-article-meta::findElements(): this.deleteBtn:', this.deleteBtn);
        console.log('real-article-meta::findElements(): this.followBtn:', this.followBtn);
        console.log('real-article-meta::findElements(): this.favoriteBtn:', this.favoriteBtn);
    }

    setEventHandler() {
        this.shadowRoot.querySelectorAll('.article-meta a')
            .forEach(link => link.addEventListener('click', this.goLink));

        this.editBtn.addEventListener('click', this.edit);
    }

    goLink = (evt) => {
        evt.preventDefault();
        console.log('real-article-meta::goLink(): evt.target.closest(a):', evt.target.closest('a'));

        const url = evt.target.closest('a')?.href;
        console.log('real-article-meta::goLink(): url:', url);
        addGoAction(url)
    }

    edit = (evt) => {
        evt.preventDefault();
        console.log('real-article-meta::edit(): evt.target:', evt.target);

        addGoAction(`/editor/${this.slug}`)
    }

    render() {

    }
}
customElements.define('real-article-meta', RealArticleMeta);
export {RealArticleMeta}
