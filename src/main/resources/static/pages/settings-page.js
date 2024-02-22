import {iconCdn} from "../services/icon-cdn.js";
import {actionQueue} from "../services/action-queue.js";

const style = `<style>
</style>`;

const getTemplate = () => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/form.css">
        <link rel="stylesheet" href="../css/register-login.css">
        ${style}
        
        <div class="settings-page">
            <div class="container page">
                <div class="row">
                    <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>
    
                    <ul class="error-messages">
                        <li>That name is required</li>
                    </ul>
    
                    <form>
                        <fieldset>
                            <fieldset class="form-group">
                                <input class="form-control" type="text" placeholder="URL of profile picture" />
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea
                                    class="form-control form-control-lg"
                                    rows="8"
                                    placeholder="Short bio about you"
                                ></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Email" />
                            </fieldset>
                            <fieldset class="form-group">
                            <input
                                class="form-control form-control-lg"
                                type="password"
                                placeholder="New Password"
                            />
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right update">Update Settings</button>
                        </fieldset>
                    </form>
                    <hr />
                    <button class="btn btn-outline-danger logout">Or click here to logout.</button>
                </div>
            </div>
        </div>
    </div>
    `
}

class SettingsPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = getTemplate();

        this.findElements();
        this.setEventHandler();
    }

    connectedCallback() {
        this.render();
    }

    findElements() {
    }

    setEventHandler() {
        console.log('settings-page::setEventHandler(): 1:', 1);

        this.updateBtn = this.shadowRoot.querySelector('button.update');
        this.shadowRoot.querySelector('button.logout')
            ?.addEventListener('click', (evt) => {
                evt.preventDefault();
                actionQueue.addAction({
                    type: 'logout',
                    nextRoute: '/'
                });
            });
    }

    render() {
    }
}
customElements.define('settings-page', SettingsPage);
export {SettingsPage}
