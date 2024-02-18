class RealSidebar extends HTMLElement {

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
        // this.className = 'col-md-3';
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
            ${style()}
            
            <div class="sidebar">
                <p>Popular Tags</p>

                <div class="tag-list">
                    <a href="" class="tag-pill tag-default">programming</a>
                    <a href="" class="tag-pill tag-default">javascript</a>
                    <a href="" class="tag-pill tag-default">emberjs</a>
                    <a href="" class="tag-pill tag-default">angularjs</a>
                    <a href="" class="tag-pill tag-default">react</a>
                    <a href="" class="tag-pill tag-default">mean</a>
                    <a href="" class="tag-pill tag-default">node</a>
                    <a href="" class="tag-pill tag-default">rails</a>
                </div>
            </div>
        `
    }
}
customElements.define('real-sidebar', RealSidebar);
export {RealSidebar}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
            .sidebar {
                padding: 5px 10px 10px;
                background: #f3f3f3;
                border-radius: 4px
            }
            
            .sidebar p {
                margin-bottom: .2rem
            }            
            
           .tag-pill {
                padding-right: .6em;
                padding-left: .6em;
                border-radius: 10rem
            }
            
            .tag-default[href]:focus, .tag-default[href]:hover {
                background-color: #687077
            }
            
            .tag-default {
                color: #fff !important;
                background-color: #818a91;
                font-size: .8rem;
                padding-top: .1rem;
                padding-bottom: .1rem;
                white-space: nowrap;
                margin-right: 3px;
                margin-bottom: .2rem;
                display: inline-block
            }
            
            .tag-default:hover {
                text-decoration: none
            }
            
        </style>`;
}
