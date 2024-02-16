import {actionQueue} from "../action-queue.js";

class LoginPage extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    login(evt) {
        evt.preventDefault();
        console.log('login-page::login(): 1:', 1);

        actionQueue.addAction({
            type: 'login',
            data: {
                email: 'cider@drink.com',
                password: '1234'
            }
        });

        actionQueue.addAction({
            type: 'go',
            data: {
                name: 'home',
            }
        });
    }

    render() {
        this.shadow.innerHTML = `
            ${style()}
            
            <div class="auth-page">
              <div class="container page">
                <div class="row">
                  <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Sign in</h1>
                    <p class="text-xs-center">
                      <a href="/register">Need an account?</a>
                    </p>
            
                    <ul class="error-messages">
                      <li>That email is already taken</li>
                    </ul>
            
                    <form>
                      <fieldset class="form-group">
                        <input class="form-control form-control-lg" type="text" placeholder="Email" />
                      </fieldset>
                      <fieldset class="form-group">
                        <input class="form-control form-control-lg" type="password" placeholder="Password" />
                      </fieldset>
                      <button class="btn btn-lg btn-primary pull-xs-right">Sign in</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('login-page::setEventHandler(): 1:', 1);

        this.shadow.querySelector('button').addEventListener('click', this.login);
    }
}
customElements.define('login-page', LoginPage);
export {LoginPage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">
        <link rel="stylesheet" href="../css/register-login.css">

        <style>
        
        </style>`;
}
