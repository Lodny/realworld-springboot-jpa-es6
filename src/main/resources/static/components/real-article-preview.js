import {store} from "../services/store.js";
import {iconCdn} from "../services/icon-cdn.js";
import {actionQueue} from "../services/action-queue.js";

class RealArticlePreview extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        const slug = this.getAttribute('slug');
        console.log('real-article-preview::constructor(): slug:', slug);
        if (!slug)
            throw Error('slug is required');

        this.article = store.getArticle(slug);
        console.log('real-article-preview::constructor(): this.article:', this.article);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const article = this.article;
        const author = article.author;
        console.log('real-article-preview::render(): article:', article);
        console.log('real-article-preview::render(): author:', author);

        console.log('real-article-preview::render(): article.favorited:', article.favorited);
        console.log('real-article-preview::render(): article.favorited:', article.favorited === true);


        this.shadow.innerHTML = `
            ${style()}
            
            <div class="article-preview">
                <div class="article-meta">
                    <a href="/profile/eric-simons"><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
                    <div class="info">
                        <a href="/profile/eric-simons" class="author">${author.username}</a>
                        <span class="date">${article.createdAt}</span>
                    </div>
                    <button class="btn btn-outline-primary btn-sm pull-xs-right ${article.favorited ? 'focus' : ''}">
                        <i class="ion-heart"></i> 29
                    </button>
                </div>
                <a href="/article/how-to-build-webapps-that-scale" class="preview-link">
                    <h1>${article.title}</h1>
                    <p>${article.description}</p>
                    <span>Read more...</span>
                    <ul class="tag-list">
                        <li class="tag-default tag-pill tag-outline">realworld</li>
                        <li class="tag-default tag-pill tag-outline">implementations</li>
                    </ul>                    
                </a>
            </div>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('real-article::setEventHandler(): 1:', 1);

        this.shadow.querySelector('button').addEventListener('click', this.favorite);
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

    callback = (article) => {
        console.log('real-article-preview::callback(): article:', article);
        this.article = store.setFavorite(article);
        console.log('real-article-preview::callback(): this.article:', this.article);

        this.render();
    }
}

customElements.define('real-article-preview', RealArticlePreview);
export {RealArticlePreview}

function style() {
    return `
        ${iconCdn}

        <link rel="stylesheet" href="../css/common.css">

        <style>
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
                background-color: #818a91
            }
            
        </style>`;
}
            // .article-page .banner .article-meta .author {
            //     color: #fff
            // }
