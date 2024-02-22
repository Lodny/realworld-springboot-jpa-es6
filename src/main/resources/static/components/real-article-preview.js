import {store} from "../services/store.js";
import {iconCdn} from "../services/icon-cdn.js";
import {actionQueue, addGoAction} from "../services/action-queue.js";

const style = `<style>
    img {
        overflow-clip-margin: content-box;
        overflow: clip;
    }
    
    a {
        color: #5CB85C;
    }
    
    a h1 {
        color: black;
    }
    
    .article-preview {
        border-top: 1px solid rgba(0, 0, 0, .1);
        padding: 1.5rem 0
    }
    
    .article-preview .article-meta {
        margin: 0 0 1rem
    }
    
    .article-preview .preview-link h1 {
        font-weight: 600 !important;
        font-size: 1.5rem !important;
        margin-bottom: 3px
    }
    
    .article-preview .preview-link p {
        font-weight: 300;
        font-size: 24px;
        color: #999;
        margin-bottom: 15px;
        font-size: 1rem;
        line-height: 1.3rem
    }
    
    .article-preview .preview-link span {
        max-width: 30%;
        font-size: .8rem;
        font-weight: 300;
        color: #bbb;
        vertical-align: middle
    }
    
    .article-preview .preview-link ul {
        float: right;
        max-width: 50%;
        vertical-align: top
    }
    
    .article-preview .preview-link ul li {
        font-weight: 300;
        font-size: .8rem !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important
    }
</style>`;

const getTemplate = (article) => {
    const author = article.author;
    //todo::tag

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/article-meta.css">
        <link rel="stylesheet" href="../css/tag.css">
        ${style}
    
        <div class="article-preview">
            <div class="article-meta">
                <a href="/profile/${author.username}"><img src="${author.image}" /></a>
                <div class="info">
                    <a href="/profile/${author.username}" class="author">${author.username}</a>
                    <span class="date">${article.createdAt}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right ${article.favorited ? 'focus' : ''}">
                    <i class="ion-heart"></i> 10
                </button>
            </div>
            <a href="/article/${article.slug}" class="preview-link">
                <h1>${article.title}</h1>
                <p>${article.description}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                ${
                    article.tagList.map(tag => `<li class="tag-default tag-pill tag-outline">${tag}</li>`).join('')
                }
                </ul>
            </a>
        </div>
    `;
}


class RealArticlePreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.article = this.getArticle();
        console.log('real-article-preview::constructor(): this.article:', this.article);

        this.shadowRoot.innerHTML = getTemplate(this.article);

        this.findElements();
        this.setEventHandler();
    }

    getArticle() {
        const slug = this.getAttribute('slug');
        console.log('real-article-preview::constructor(): slug:', slug);
        if (!slug)
            throw Error('slug is required');

        return store.getArticle(slug);
    }

    connectedCallback() {
        this.updateFavorite(this.article);
    }

    findElements() {
        this.articleLink = this.shadowRoot.querySelector('a.preview-link');
        this.favoriteButton = this.shadowRoot.querySelector('button');
    }

    setEventHandler() {
        console.log('real-article::setEventHandler(): 1:', 1);

        this.favoriteButton.addEventListener('click', this.favorite);
        this.shadowRoot.querySelectorAll('.article-meta a')
            .forEach(link => link.addEventListener('click', this.goLink));
        this.articleLink.addEventListener('click', this.goLink);
    }

    favorite = () => {
        console.log('real-article-preview::favorite(): this.article:', this.article);

        actionQueue.addAction({
            type: this.article.favorited ? 'unfavorite' : 'favorite',
            data: {
                name: this.article.slug,
            },
            callback: this.callback
        });
    }

    goLink = (evt) => {
        evt.preventDefault();
        console.log('real-article-preview::goLink(): evt.target.closest(a):', evt.target.closest('a'));

        const url = evt.target.closest('a')?.href;
        console.log('real-article-preview::goLink(): url:', url);
        addGoAction(url);
    }

    callback = ({type, result}) => {
        console.log('real-article-preview::callback(): type:', type);
        console.log('real-article-preview::callback(): result:', result);

        if (!result) return;

        this.article = result;
        store.setArticle(this.article);
        console.log('real-article-preview::callback(): this.article:', this.article);

        this.updateFavorite(this.article);
    }

    updateFavorite(article) {
        console.log('real-article-preview::updateFavorite(): 1:', 1);
        this.favoriteButton.innerHTML = `<i class="ion-heart"></i> ${article.favoritesCount}`;
        article.favorited
            ? this.favoriteButton.classList.add('focus')
            : this.favoriteButton.classList.remove('focus');
    }
}

customElements.define('real-article-preview', RealArticlePreview);
export {RealArticlePreview}


