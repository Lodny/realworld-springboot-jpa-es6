import {iconCdn} from "../services/icon-cdn.js";

const style = `<style>
    .card {
        border: 1px solid #e5e5e5;
        box-shadow: none !important
    }
    
    .card .card-footer {
        border-top: 1px solid #e5e5e5;
        box-shadow: none !important;
        font-size: .8rem;
        font-weight: 300
    }
    
    .card .comment-author-img {
        display: inline-block;
        vertical-align: middle;
        height: 20px;
        width: 20px;
        border-radius: 30px
    }
    
    .card .comment-author {
        display: inline-block;
        vertical-align: middle
    }
    
    .card .date-posted {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        color: #bbb
    }
    
    .card .mod-options {
        float: right;
        color: #333;
        font-size: 1rem
    }
    
    .card .mod-options i {
        margin-left: 5px;
        opacity: .6;
        cursor: pointer
    }
    
    .card .mod-options i:hover {
        opacity: 1
    }     
</style>`;

const getTemplate = (comment) => {
    const author = comment.author;

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/card.css">
        ${style}
        
        <div class="card">
            <div class="card-block">
                <p class="card-text">
                    ${comment.comment}
                </p>
            </div>
            <div class="card-footer">
                <a href="/profile/${author.username}" class="comment-author">
                    <img src="${author.image}" class="comment-author-img" />
                </a>
                &nbsp;
                <a href="/profile/${author.username}" class="comment-author">${author.username}</a>
                <span class="date-posted">${comment.createdAt}</span>
                <span class="mod-options">
                    <i class="ion-trash-a"></i>
                </span>
            </div>
        </div>
    `;
}

class RealComment extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const commentId = this.getAttribute('id');
        const comment = getComment(commentId);
        this.shadowRoot = getTemplate(comment);

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
customElements.define('real-comment', RealComment);
export {RealComment}