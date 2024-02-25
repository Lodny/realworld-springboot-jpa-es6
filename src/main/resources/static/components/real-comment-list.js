import {iconCdn} from "../services/icon-cdn.js";
import {currentUser, store} from "../services/store.js";
import {actionQueue, addGoAction} from "../services/action-queue.js";
import {realApi} from "../services/api.js";
import {RealComment} from "./real-comment.js";

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
    
    p {
        margin-bottom: 1rem;
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

        this.slug = this.getAttribute('slug');
        console.log('real-comment-list::constructor(): this.slug:', this.slug);

        const user = currentUser();
        console.log('real-comment-list::constructor(): user:', user);

        this.shadowRoot.innerHTML = getTemplate(user);

        this.findElements();
        this.setEventHandler();
    }

    async connectedCallback() {
        const data = await realApi.getComments(this.slug);
        console.log('real-comment-list::connectedCallback(): data:', data);

        this.comments = data.comments;
        console.log('real-comment-list::connectedCallback(): this.comments:', this.comments);

        store.set("comments", this.comments);
        this.updateComments(this.comments);
    }

    findElements() {
        this.links = this.shadowRoot.querySelectorAll('a');
        this.commentsTag = this.shadowRoot.querySelector('.comments')
        this.textareaTag = this.shadowRoot.querySelector('textarea');
    }

    setEventHandler() {
        console.log('real-comment-list::setEventHandler(): 1:', 1);
        this.links.forEach(link => link.addEventListener('click', this.goLink));

        this.shadowRoot
            .querySelector('button')
            ?.addEventListener('click', this.addComment);
    }

    goLink = (evt) => {
        evt.preventDefault();
        console.log('real-comment-list::goLink(): evt.target.href', evt.target.href);

        addGoAction(evt.target.href);
    }

    addComment = (evt) => {
        evt.preventDefault();

        const body = this.textareaTag.value;
        console.log('real-comment-list::addComment(): body:', body);

        actionQueue.addAction({
            type: 'addComment',
            data: {
                slug: this.slug,
                value: body,
            },
            callback: this.callback
        });

        this.textareaTag.value = '';
    }

    callback = ({type, result}) => {
        console.log('real-comment-list::callback(): type, result', type, result);

        if (type === 'addComment') {
            this.comments = store.get('comments');
            console.log('real-comment-list::callback(): this.comments:', this.comments);

            // this.updateComments(this.comments);
            this.insertComment(result.id);
        }
    }

    render() {

    }

    insertComment(commentId) {
        const newComment = `<real-comment slug="${this.slug}" id="${commentId}"></real-comment>`
        this.commentsTag.insertAdjacentHTML('afterbegin', newComment);

    }

    updateComments(comments) {
        this.commentsTag.innerHTML = comments
            .map(comment => `<real-comment slug="${this.slug}" id="${comment.id}"></real-comment>`)
            .join('');
    }
}
customElements.define('real-comment-list', RealCommentList);
export {RealCommentList}
