import {iconCdn} from "../services/icon-cdn.js";
import {currentUser} from "../services/store.js";

const style = `<style>
    .comment-form {
        border: 1px solid #e5e5e5;
    }
    
    .comment-form .card-block {
        padding: 0
    }
    
    .comment-form .card-block textarea {
        border: 0;
        padding: 1.25rem
    }
    
    .comment-form .card-footer .btn {
        font-weight: 700;
        float: right
    }
    
    .comment-form .card-footer .comment-author-img {
        height: 30px;
        width: 30px
    }
    
    p a {
        color: #5CB85C;
    }
</style>`;

const getTemplate = (user) => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/article-meta.css">
        <link rel="stylesheet" href="../css/card.css">
        <link rel="stylesheet" href="../css/form.css">
        ${style}
        
        ${!user ? `
        <p>
            <a href="#/login">Sign in</a> or <a href="#/register">sign up</a> to add comments on this article.
        </p>
        ` : `
        <form class="card comment-form">
            <div class="card-block">
                <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
                <img src="${user.image}" class="comment-author-img" />
                <button class="btn btn-sm btn-primary">Post Comment</button>
            </div>
        </form>
        `}

        <div class="comments"></div>
    `;
}

class RealCommentList extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // const slug = this.getAttribute('slug');
        // console.log('real-comment-list::constructor(): slug:', slug);
        const user = currentUser();
        console.log('real-comment-list::constructor(): user:', user);
        this.shadowRoot.innerHTML = getTemplate(user);

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
customElements.define('real-comment-list', RealCommentList);
export {RealCommentList}
