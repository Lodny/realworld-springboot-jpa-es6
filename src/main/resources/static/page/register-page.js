class RegisterPage extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
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
    }
}
customElements.define('register-page', RegisterPage);
export {RegisterPage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">
        
        <style>
            .page {
                margin-top: 1.5rem;
            }
            
            .container {
                max-width: 720px;
            }
            
            a {
               color: #5CB85C;
            }
            
            .row {
                display: flex;
                flex-wrap: wrap;
                margin-left: -15px;
                margin-right: -15px;
            }

            .col-md-6 {
                position: relative;
                min-height: 1px;
                padding-right: 15px;
                padding-left: 15px;
                flex: 0 0 50%;
                max-width: 50%;
            }
            
            .offset-md-3 {
                margin-left: 25%;
            }
            
            .form-control {
                width: 100%;
                line-height: 1.25;
                color: #55595c;
                background-color: #fff;
                background-image: none;
                background-clip: padding-box;
                border: 1px solid rgba(0, 0, 0, 0.15);
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            fieldset {
                min-width: 0;
                padding: 0;
                margin: 0;
                border: 0;
            }
            
            .form-control-lg {
                padding: 0.75rem 1.5rem;
                font-size: 1.25rem;
                border-radius: 0.3rem;
            }
            
            .text-xs-center {
                text-align: center !important;
            }
            .btn-primary {
                color: #fff;
                background-color: #5CB85C;
                border-color: #5CB85C;
            }
            .btn-primary:hover {
                color: #fff;
                background-color: #449d44;
                border-color: #419641;
            }
            .btn:focus, .btn:hover {
                text-decoration: none;
            }
            .pull-xs-right {
                float: right !important;
            }
            .btn-lg, .btn-group-lg > .btn {
                padding: 0.75rem 1.5rem;
                font-size: 1.25rem;
                border-radius: 0.3rem;
            }
            
            .btn {
                display: inline-block;
                font-weight: normal;
                line-height: 1.25;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                cursor: pointer;
                user-select: none;
                border: 1px solid transparent;
            }
            
        </style>`;
}
