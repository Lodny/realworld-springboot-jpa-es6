import {iconCdn} from "../services/icon-cdn.js";
import {actionQueue} from "../services/action-queue.js";

const style = `<style>
</style>`;

const getTemplate = () => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/form.css">
        <link rel="stylesheet" href="../css/tag.css">
        ${style}
        
        <div class="editor-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-10 offset-md-1 col-xs-12">
                        <ul class="error-messages">
                            <li>That title is required</li>
                        </ul>
        
                        <form>
                            <fieldset>
                                <fieldset class="form-group">
                                    <input type="text" class="form-control form-control-lg title" placeholder="Article Title" />
                                </fieldset>
                                <fieldset class="form-group">
                                    <input type="text" class="form-control description" placeholder="What's this article about?" />
                                </fieldset>
                                <fieldset class="form-group">
                                    <textarea
                                        class="form-control"
                                        rows="8"
                                        placeholder="Write your article (in markdown)"
                                    ></textarea>
                                </fieldset>
                                <fieldset class="form-group">
                                    <input type="text" class="form-control tags" placeholder="Enter tags" />
                                    <div class="tag-list">                                        
                                    </div>
                                </fieldset>
                                <button class="btn btn-lg pull-xs-right btn-primary" type="button" tabindex="-1">
                                    Publish Article
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>    
    `;
}


class EditorPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = getTemplate();

        this.tags = [];

        this.findElements();
        this.setEventHandler();
    }

    connectedCallback() {
        this.render();
    }

    findElements() {
        this.registerBtn = this.shadowRoot.querySelector('button');
        this.titleInput = this.shadowRoot.querySelector('input.title');
        this.descriptionInput = this.shadowRoot.querySelector('input.description');
        this.bodyTextarea = this.shadowRoot.querySelector('textarea');
        this.tagsInput = this.shadowRoot.querySelector('input.tags');
    }

    setEventHandler() {
        console.log('editor-page::setEventHandler(): 1:', 1);
        this.registerBtn.addEventListener('click', this.registerArticle);
        this.tagsInput.addEventListener('keyup', this.enterKeyUp)
    }

    enterKeyUp = (evt) => {
        console.log('editor-page::enterKeyUp(): evt.code', evt.code);

        if (evt.code === 'Enter' || evt.code === 'NumpadEnter') {
            this.tags.push(this.tagsInput.value);
            this.updateTags();
            this.tagsInput.value = '';
        }
    }

    registerArticle = (evt) => {
        evt.preventDefault();
        this.shadowRoot.activeElement?.blur();
        console.log('editor-page::registerArticle(): evt', evt);

        const article = {
            title: this.titleInput.value,
            description: this.descriptionInput.value,
            body: this.bodyTextarea.value,
            tagList: this.tags
        };
        console.log('editor-page::registerArticle(): article:', article);

        actionQueue.addAction({
            type: 'registerArticle',
            data: {
                value: article
            },
            nextRoute: '/',
            callback: this.callback,
        })
    }

    callback = ({type, result}) => {
        console.log('editor-page::callback(): type, result:', type, result);

        if (type === 'error') {
            if (result.startsWith('title')) {
                this.titleInput.focus();
            } else if (result.startsWith('description')) {
                this.descriptionInput.focus();
            } else if (result.startsWith('body')) {
                this.bodyTextarea.focus();
            }
        }
    }

    render() {
    }

    updateTags() {
        this.shadowRoot.querySelector('.tag-list').innerHTML = this.tags
            .map(tag => `<span class="tag-default tag-pill"> <i class="ion-close-round"></i> ${tag} </span>`)
            .join('');
    }
}
customElements.define('editor-page', EditorPage);
export {EditorPage}
