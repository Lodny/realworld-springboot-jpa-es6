import {iconCdn} from "../services/icon-cdn.js";
import {apiGetProfile} from "../services/api.js";
import {currentUser, store} from "../services/store.js";

const style = `<style>
    .banner {
        color: #fff;
        background: #333;
        padding: 2rem;
        margin-bottom: 2rem
    }
    
    .banner h1 {
        text-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        margin-bottom: 0
    }

    .article-page .banner {
        padding: 2rem 0
    }
    
    .article-page .banner h1 {
        font-size: 2.8rem;
        font-weight: 600
    }
    
    .article-page .banner .btn {
        opacity: .8
    }
    
    .article-page .banner .btn:hover {
        transition: .1s all;
        opacity: 1
    }
    
    .article-page .banner .article-meta {
        margin: 2rem 0 0
    }
    
    .article-page .banner .article-meta .author {
        color: #fff
    }
    
    .article-page .article-content p {
        font-family: 'source serif pro', serif;
        font-size: 1.2rem;
        line-height: 1.8rem;
        margin-bottom: 2rem
    }
    
    .article-page .article-content h1, .article-page .article-content h2, .article-page .article-content h3, .article-page .article-content h4, .article-page .article-content h5, .article-page .article-content h6 {
        font-weight: 500 !important;
        margin: 1.6rem 0 1rem
    }
    
    .article-page .article-actions {
        text-align: center;
        margin: 1.5rem 0 3rem
    }
    
    .article-page .article-actions .article-meta .info {
        text-align: left
    }
    
    .article-page .comment-form .card-block {
        padding: 0
    }
    
    .article-page .comment-form .card-block textarea {
        border: 0;
        padding: 1.25rem
    }
    
    .article-page .comment-form .card-footer .btn {
        font-weight: 700;
        float: right
    }
    
    .article-page .comment-form .card-footer .comment-author-img {
        height: 30px;
        width: 30px
    }
    
    .article-page .card {
        border: 1px solid #e5e5e5;
        box-shadow: none !important
    }
    
    .article-page .card .card-footer {
        border-top: 1px solid #e5e5e5;
        box-shadow: none !important;
        font-size: .8rem;
        font-weight: 300
    }
    
    .article-page .card .comment-author-img {
        display: inline-block;
        vertical-align: middle;
        height: 20px;
        width: 20px;
        border-radius: 30px
    }
    
    .article-page .card .comment-author {
        display: inline-block;
        vertical-align: middle
    }
    
    .article-page .card .date-posted {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        color: #bbb
    }
    
    .article-page .card .mod-options {
        float: right;
        color: #333;
        font-size: 1rem
    }
    
    .article-page .card .mod-options i {
        margin-left: 5px;
        opacity: .6;
        cursor: pointer
    }
    
    .article-page .card .mod-options i:hover {
        opacity: 1
    }     
    
    .col-xs-12 {
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
        flex: 0 0 100%;
        max-width: 100%
    }
    
    hr {
        margin-top: 1rem;
        margin-bottom: 1rem;
        border: 0;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    p {
        margin-bottom: 1rem;
    }
    
    .container.page a {
        color: #5CB85C;
    }
</style>`;

const getTemplate = (article, bLogin) => {
    const author = article.author;

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/article-meta.css">
        <link rel="stylesheet" href="../css/tag.css">
        <link rel="stylesheet" href="../css/card.css">
        <link rel="stylesheet" href="../css/form.css">
        ${style}

        <div class="article-page">
            <div class="banner">
                <div class="container">
                    <h1>${article.title}</h1>
        
                    <div class="article-meta">
                        <a href="/profile/${author.username}"><img src="${author.image}" /></a>
                        <div class="info">
                            <a href="/profile/${author.username}" class="author">${author.username}</a>
                            <span class="date">${article.createdAt}</span>
                        </div>
                        
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="ion-plus-round"></i>
                            &nbsp; Follow ${author.username} <span class="counter">(?)</span>
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="ion-heart"></i>
                            &nbsp; Favorite Post <span class="counter">(${article.favoritesCount})</span>
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
                </div>
            </div>
            
            <div class="container page">
                <div class="row article-content">
                    <div class="col-xs-12">
                        <p>
                            ${article.body}
                        </p>
                        <ul class="tag-list">
                        ${
                            article.tagList.map(tag => `<li class="tag-default tag-pill tag-outline">${tag}</li>`).join('')
                        }
                        </ul>
                    </div>
                </div>
                
                <hr />
                
                <div class="article-actions">
                    <div class="article-meta">
                        <a href="/profile/${author.username}"><img src="${author.image}" /></a>
                        <div class="info">
                            <a href="/profile/${author.username}" class="author">${author.username}</a>
                            <span class="date">${article.createdAt}</span>
                        </div>
                        
                        <button class="btn btn-sm btn-outline-secondary">
                            <i class="ion-plus-round"></i>
                            &nbsp; Follow ${author.username} <span class="counter">(?)</span>
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="ion-heart"></i>
                            &nbsp; Favorite Post <span class="counter">(${article.favoritesCount})</span>
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
                </div>          
                
                <div class="row">
                    <div class="col-md-8 offset-md-2">
                        <p>
                            <a href="#/login">Sign in</a> or <a href="#/register">sign up</a> to add comments on this article.
                        </p>
                        <form class="card comment-form">
                            <div class="card-block">
                                <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                            </div>
                            <div class="card-footer">
                                <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                                <button class="btn btn-sm btn-primary">Post Comment</button>
                            </div>
                        </form>
                
                        <div class="card">
                            <div class="card-block">
                                <p class="card-text">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                            <div class="card-footer">
                                <a href="/profile/author" class="comment-author">
                                    <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                                </a>
                                &nbsp;
                                <a href="/profile/jacob-schmidt" class="comment-author">Jacob Schmidt</a>
                                <span class="date-posted">Dec 29th</span>
                            </div>
                        </div>
                
                        <div class="card">
                            <div class="card-block">
                                <p class="card-text">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                            <div class="card-footer">
                                <a href="/profile/author" class="comment-author">
                                    <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                                </a>
                                &nbsp;
                                <a href="/profile/jacob-schmidt" class="comment-author">Jacob Schmidt</a>
                                <span class="date-posted">Dec 29th</span>
                                <span class="mod-options">
                              <i class="ion-trash-a"></i>
                            </span>
                            </div>
                        </div>
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
        const user = currentUser();
        this.shadowRoot.innerHTML = getTemplate(article, !!user);

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

