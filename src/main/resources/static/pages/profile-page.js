import {iconCdn} from "../services/icon-cdn.js";
import {currentUser} from "../services/store.js";
import {actionQueue} from "../services/action-queue.js";
import {followUser, unfollowUser, getProfile} from "../services/api.js";

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

const getTemplate = () => {

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
        this.shadowRoot.innerHTML = getTemplate();

        this.findElements();
        this.setEventHandler();
    }

    async connectedCallback() {
        const profileUsername = this.getAttribute('pathName');
        const data = await getProfile(profileUsername);
        this.profile = data.profile;
        console.log('profile-page::connectedCallback(): this.profile:', this.profile);

        this.render(this.profile);
    }

    findElements() {
        this.profileNameH4 = this.shadowRoot.querySelector('h4');
        this.bioP = this.shadowRoot.querySelector('p');
        this.image = this.shadowRoot.querySelector('img');
        this.followButton = this.shadowRoot.querySelector('button.follow');
        this.editButton = this.shadowRoot.querySelector('button.edit');
    }

    setEventHandler() {
        console.log('profile-page::setEventHandler(): 1:', 1);
        this.followButton.addEventListener('click', this.follow);
        this.editButton.addEventListener('click', this.edit);
    }

    render(profile) {
        console.log('profile-page::render(): profile:', profile);

        this.updateProfile(profile);
        this.updateButtons(profile);
        this.updateFollowing(profile);
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

    follow = async (evt) => {
        evt.preventDefault();
        console.log('profile-page::follow(): 1:', 1);

        const user = currentUser();
        if (!user) {
            actionQueue.addAction({
                type: 'route',
                data: {
                    name: 'login'
                }
            })
            return;
        }

        let data;
        if (this.profile.following)
            data = await unfollowUser(this.profile.username);
        else
            data = await followUser(this.profile.username);
        this.profile = data.profile;
        console.log('profile-page::follow(): this.profile:', this.profile);
        this.updateFollowing(this.profile);
    }

    edit = (evt) => {
        evt.preventDefault();
        console.log('profile-page::edit(): 1:', 1);

        actionQueue.addAction({
            type: 'route',
            data: {
                name: 'settings'
            }
        })
    }
}
customElements.define('profile-page', ProfilePage);
export {ProfilePage}

