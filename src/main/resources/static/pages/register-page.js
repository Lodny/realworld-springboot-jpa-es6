import {actionQueue} from "../services/action-queue.js";

class RegisterPage extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    register(evt) {
        evt.preventDefault();
        console.log('register-page::register(): 1:', 1);

        actionQueue.addAction({
            type: 'register-user',
            data: {
                username: 'cider',
                email: 'cider@drink.com',
                password: '1234'
            },
            nextRoute: '/'
        });
    }

    render() {
        this.shadow.innerHTML = `
            ${style()}
            
            <div class="auth-page">
              <div class="container page">
                <div class="row">
                  <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Sign up</h1>
                    <p class="text-xs-center">
                      <a href="/login">Have an account?</a>
                    </p>
            
                    <ul class="error-messages">
                      <li>That email is already taken</li>
                    </ul>
            
                    <form>
                      <fieldset class="form-group">
                        <input class="form-control form-control-lg" type="text" placeholder="Username" />
                      </fieldset>
                      <fieldset class="form-group">
                        <input class="form-control form-control-lg" type="text" placeholder="Email" />
                      </fieldset>
                      <fieldset class="form-group">
                        <input class="form-control form-control-lg" type="password" placeholder="Password" />
                      </fieldset>
                      <button class="btn btn-lg btn-primary pull-xs-right">Sign up</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>    
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('register-page::setEventHandler(): 1:', 1);

        this.shadow.querySelector('button').addEventListener('click', this.register);
    }
}
customElements.define('register-page', RegisterPage);
export {RegisterPage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/form.css">
        <link rel="stylesheet" href="../css/register-login.css">
        
        <style>            
            
        </style>`;
}
