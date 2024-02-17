import {RealBanner} from '../components/real-banner.js'
import {RealArticle} from '../components/real-article.js'
import {RealSidebar} from '../components/real-sidebar.js'

class HomePage extends HTMLElement {
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
            
            <div class="home-page">
                <real-banner></real-banner>            
            
                <div class="container page">
                    <div class="row">
                        <div class="col-md-9">
                            <div class="feed-toggle">
                                <ul class="nav nav-pills outline-active">
                                    <li class="nav-item">
                                        <a class="nav-link" href="">Your Feed</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link active" href="">Global Feed</a>
                                    </li>
                                </ul>
                            </div>
            
                            <real-article></real-article>
            
                            <ul class="pagination">
                                <li class="page-item active">
                                    <a class="page-link" href="">1</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="">2</a>
                                </li>
                            </ul>
                        </div>
            
                        <real-sidebar class="col-md-3"></real-sidebar>
                    </div>
                </div>
            </div>            
        `;

        this.setEventHandler();
    }

    setEventHandler() {
        console.log('home-page::setEventHandler(): 1:', 1);
    }
}
customElements.define('home-page', HomePage);
export {HomePage}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">
        
        <style>
            .container.page {
                margin-top: 1.5rem;
            }
            
            @media (min-width: 544px) {
                .col-md-9 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 75%;
                    max-width: 75%;
                }
                
                .col-md-3 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 25%;
                    max-width: 25%;
                }
            }

            @media (min-width: 768px) {
                .col-md-9 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 75%;
                    max-width: 75%;
                }
                
                .col-md-3 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 25%;
                    max-width: 25%;
                }
            }

            @media (min-width: 992px) {
                .col-md-9 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 75%;
                    max-width: 75%;
                }
                
                .col-md-3 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 25%;
                    max-width: 25%;
                }
            }

            @media (min-width: 1200px) {
                .col-md-9 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 75%;
                    max-width: 75%;
                }
                
                .col-md-3 {
                    position: relative;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                    flex: 0 0 25%;
                    max-width: 25%;
                }
            }
            
                        
        </style>`;
}
