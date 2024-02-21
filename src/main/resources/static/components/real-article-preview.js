import {store} from "../services/store.js";
import {iconCdn} from "../services/icon-cdn.js";
import {actionQueue} from "../services/action-queue.js";
import {getRouteByUrl} from "../services/routes.js";

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
    
    .article-meta {
        display: block;
        position: relative;
        font-weight: 300
    }
    
    .article-meta img {
        display: inline-block;
        vertical-align: middle;
        height: 32px;
        width: 32px;
        border-radius: 30px
    }
    
    .article-meta .info {
        margin: 0 1.5rem 0 .3rem;
        display: inline-block;
        vertical-align: middle;
        line-height: 1rem
    }
    
    .article-meta .info .author {
        display: block;
        font-weight: 500 !important
    }
    
    .article-meta .info .date {
        color: #bbb;
        font-size: .8rem;
        display: block
    }
    
    .tag-pill {
        padding-right: .6em;
        padding-left: .6em;
        border-radius: 10rem
    }
    
    .tag-default {
        color: #fff !important;
        background-color: #818a91;
        font-size: .8rem;
        padding-top: .1rem;
        padding-bottom: .1rem;
        white-space: nowrap;
        margin-right: 3px;
        margin-bottom: .2rem;
        display: inline-block
    }
</style>`;
// .article-page .banner .article-meta .author {
//     color: #fff
// }

const getTemplate = (article) => {
    const author = article.author;
    //todo::image
    //todo::tag

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
    
        <div class="article-preview">
            <div class="article-meta">
                <a href="/profile/${author.username}"><img src="https://api.realworld.io/images/demo-avatar.png" /></a>
                <div class="info">
                    <a href="/profile/${author.username}" class="author">${author.username}</a>
                    <span class="date">${article.createdAt}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right ${article.favorited ? 'focus' : ''}">
                    <i class="ion-heart"></i> 10
                </button>
            </div>
            <a href="/article/how-to-build-webapps-that-scale" class="preview-link">
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

    // static get observedAttributes() {
    //     return ['favoritesCount'];
    // }

    connectedCallback() {
        this.updateFavorite(this.article);
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (name === 'favoritesCount' && oldValue !== newValue) {
    //         this.updateFavorite(newValue);
    //     }
    // }

    findElements() {
        this.favoriteButton = this.shadowRoot.querySelector('button');
    }

    setEventHandler() {
        console.log('real-article::setEventHandler(): 1:', 1);

        this.favoriteButton.addEventListener('click', this.favorite);
        this.shadowRoot.querySelectorAll('.article-meta a')
            .forEach(link => link.addEventListener('click', this.goProfile));
        this.shadowRoot.querySelector('.preview-link').addEventListener('click', this.goArticle);
    }

    favorite = () => {
        console.log('real-article-preview::favorite(): 1:', 1);
        const user = store.get("user");
        if (!user) {
            actionQueue.addAction({
                type: 'route',
                data: {
                    name: 'login'
                }
            });

            return;
        }

        console.log('real-article-preview::favorite(): this.article:', this.article);
        actionQueue.addAction({
            type: this.article.favorited === false ? 'favorite' : 'unfavorite',
            data: {
                name: this.article.slug,
            },
            callback: this.callback
        });
    }

    goProfile = (evt) => {
        evt.preventDefault();
        console.log('real-article-preview::profile(): 1:', 1);
        console.log('real-article-preview::goProfile(): evt.target.href:', evt.target.href);

        const route = getRouteByUrl(evt.target.href);
        console.log('real-article-preview::goProfile(): route:', route);
        actionQueue.addAction({
            type: 'route',
            data: {
                name: route,
            },
        });
    }

    goArticle = (evt) => {
        evt.preventDefault();
        console.log('real-article-preview::goArticle(): 1:', 1);
        console.log('real-article-preview::goArticle(): evt.target.href:', evt.target.href);

    }

    callback = (article) => {
        console.log('real-article-preview::callback(): article:', article);
        this.article = article;
        store.setArticle(this.article);
        console.log('real-article-preview::callback(): this.article:', this.article);

        this.updateFavorite(this.article);
    }

    // changeFavoritesCount(article) {
    //     this.setAttribute('favoritesCount', article.favoritesCount);
    // }

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


