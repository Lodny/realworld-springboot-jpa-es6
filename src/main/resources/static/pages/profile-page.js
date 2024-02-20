import {iconCdn} from "../services/icon-cdn.js";
import {store} from "../services/store.js";
import {actionQueue} from "../services/action-queue.js";
import {getProfile} from "../services/api.js";

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
    
    .profile-page .articles-toggle {
        margin: 1.5rem 0 -1px
    }
</style>`;

const getTemplate = (yourself, profile) => {

    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
        
        <div class="profile-page">
            <div class="user-info">
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12 col-md-10 offset-md-1">
                            <img src="https://api.realworld.io/images/demo-avatar.png" class="user-img" />
                            <h4>Eric Simons</h4>
                            <p>
                                Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from
                                the Hunger Games
                            </p>
                            <button class="btn btn-sm btn-outline-secondary action-btn follow">
                                <i class="ion-plus-round"></i> &nbsp; Follow Eric Simons
                            </button>
                            <button class="btn btn-sm btn-outline-secondary action-btn edit" style="display: none">
                                <i class="ion-gear-a"></i> &nbsp; Edit Profile Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

class ProfilePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        this.profileUsername = this.getAttribute('pathName');
        console.log('profile-page::constructor(): this.profileUsername:', this.profileUsername);

        this.user = store.get('user');
        console.log('profile-page::constructor(): user:', this.user);
        this.shadowRoot.innerHTML = getTemplate(this.user?.username === this.profileUsername);

        this.findElement();
        this.setEventHandler();
    }

    async connectedCallback() {
        const data = await getProfile(this.profileUsername)
        this.profile = data.profile;
        console.log('profile-page::connectedCallback(): this.profile:', this.profile);

        this.updateProfile(this.profile);
    }

    findElement() {
        this.profileNameH4 = this.shadowRoot.querySelector('h4');
        this.followButton = this.shadowRoot.querySelector('button.follow');
        this.editButton = this.shadowRoot.querySelector('button.edit');
    }

    setEventHandler() {
        console.log('profile-page::setEventHandler(): 1:', 1);
    }

    updateProfile(profile) {
        console.log('profile-page::updateProfile(): profile:', profile);

        const username = profile.username;
        this.profileNameH4.innerHTML = username;
        this.followButton.innerHTML = `<i class="ion-plus-round"></i> &nbsp; ${username}`;
        this.editButton.innerHTML = `<i class="ion-gear-a"></i> &nbsp; ${username}`;
    }
}
customElements.define('profile-page', ProfilePage);
export {ProfilePage}

