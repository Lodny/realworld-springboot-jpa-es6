import {iconCdn} from "../services/icon-cdn.js";
import {currentUser, store} from "../services/store.js";
import {actionQueue, addGoAction} from "../services/action-queue.js";

const style = `<style>
    img {
        vertical-align: middle;
    }
    
    h4 {
        font-size: 1.5rem;
        
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-family: inherit;
        font-weight: 500;
        line-height: 1.1;
        color: inherit;
    }

    .btn {    
        font-weight: normal;
    }
    
    .profile-page .user-info {
        text-align: center;
        background: #f3f3f3;
        padding: 2rem 0 1rem
    }
    
    .profile-page .user-info .user-img {
        width: 100px;
        height: 100px;
        border-radius: 100px;
        margin-bottom: 1rem
    }
    
    .profile-page .user-info h4 {
        font-weight: 700
    }
    
    .profile-page .user-info p {
        margin: 0 auto .5rem;
        color: #aaa;
        max-width: 450px;
        font-weight: 300
    }
    
    .profile-page .user-info .action-btn {
        float: right;
        color: #999;
        border: 1px solid #999
    }
</style>`;

const getTemplate = (tabTitles, activeTab) => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
        
        <div class="profile-page">
            <div class="user-info">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 col-md-10 offset-md-1">
                            <img src="" class="user-img" />
                            <h4></h4>
                            <p></p>
                            <button class="btn btn-sm btn-outline-secondary action-btn follow">
                                <i class="ion-plus-round"></i> &nbsp; Follow 
                            </button>
                            <button class="btn btn-sm btn-outline-secondary action-btn edit" style="display: none">
                                <i class="ion-gear-a"></i> &nbsp; Edit Profile Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container page">
                <div class="row">
                    <real-tab class="col-xs-12 col-md-10 offset-md-1" tab-titles="${tabTitles}" active-tab="${activeTab}">
                        <div class="articles"></div>
                        <real-paging></real-paging>
                    </real-tab>
                </div>
            </div>
        </div>
    `;
}

class ProfilePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const [tabTitles, activeTab] = this.getTabTitles();
        this.shadowRoot.innerHTML = getTemplate(tabTitles, activeTab);

        this.findElements();
        this.setEventHandler();
    }

    getTabTitles() {
        let activeTab = 'My Articles';
        let tabTitles = [activeTab, 'Favorited Articles'];

        return [tabTitles, activeTab];
    }

    connectedCallback() {
        actionQueue.addAction({
            type: 'getProfile',
            data: {
                value: this.getAttribute('pathName'),
            },
            callback: this.callback,
        });
    }

    findElements() {
        this.profileNameH4 = this.shadowRoot.querySelector('h4');
        this.bioP = this.shadowRoot.querySelector('p');
        this.image = this.shadowRoot.querySelector('img');
        this.followButton = this.shadowRoot.querySelector('button.follow');
        this.editButton = this.shadowRoot.querySelector('button.edit');

        this.tabTag = this.shadowRoot.querySelector('real-tab');
        this.articlesTag = this.shadowRoot.querySelector('.articles');
    }

    setEventHandler() {
        console.log('profile-page::setEventHandler(): 1:', 1);
        this.followButton.addEventListener('click', this.follow);
        this.editButton.addEventListener('click', this.edit);

        this.tabTag?.setCallback(this.tabEventHandler);
    }

    tabEventHandler = (activeTab) => {
        console.log('profile-page::tabEventHandler(): activeTab:', activeTab);
        this.getArticles(activeTab);
    }

    render(profile) {
        console.log('profile-page::render(): profile:', profile);

        this.updateProfile(profile);
        this.updateButtons(profile);
        this.updateFollowing(profile);
        this.updateArticles();
    }

    updateProfile(profile) {
        this.profileNameH4.innerHTML = profile.username;
        this.bioP.innerHTML = profile.bio;
        if (profile.image)
            this.image.src = profile.image;
    }

    updateButtons(profile) {
        this.user = currentUser();
        if (profile.username === this.user?.username) {
            this.followButton.style.display = 'none'
            this.editButton.style.display = 'block'
        } else {
            this.followButton.style.display = 'block'
            this.editButton.style.display = 'none'
        }
    }

    updateFollowing(profile) {
        if (profile.following)
            this.followButton.innerHTML = `<i class="ion-minus-round"></i> &nbsp; Unfollow ${profile.username}`;
        else
            this.followButton.innerHTML = `<i class="ion-plus-round"></i> &nbsp; Follow ${profile.username}`;
    }

    updateArticles(articles) {
        this.articlesTag.innerHTML = articles
            .map(article => `<real-article-preview slug="${article.slug}"></real-article-preview>`)
            .join('')
    }

    getArticles(activeTab) {
        let param = {};
        if (activeTab === 'My Articles')
            param = {author: this.profile.username}
        else if (activeTab === 'Favorited Articles')
            param = {favorited: this.profile.username}

        actionQueue.addAction({
            type: 'getArticles',
            data: {
                value: param,
            },
            callback: this.callback,
        });
    }

    callback = ({type, result}) => {
        console.log('profile-page::callback(): type, result:', type, result);

        if (type === 'getProfile') {
            this.profile = result;
            this.getArticles('My Articles');
            this.updateProfile(result);
        } else if (type === 'getArticles') {
            this.updateArticles(result);
        } else if (['follow', 'unfollow'].includes(type)) {
            this.profile = result;
            this.updateFollowing(this.profile);
        }

    }

    follow = async (evt) => {
        evt.preventDefault();
        console.log('profile-page::follow(): 1:', 1);

        const profile = this.profile;
        actionQueue.addAction({
            type: profile.following ? 'unfollow' : 'follow',
            data: {
                value: profile.username,
            },
        });
    }

    edit = (evt) => {
        evt.preventDefault();
        console.log('profile-page::edit(): 1:', 1);

        addGoAction('/settings');
    }
}
customElements.define('profile-page', ProfilePage);
export {ProfilePage}

