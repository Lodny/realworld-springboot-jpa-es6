class RealBanner extends HTMLElement {

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
            
            <div class="banner">
                <div class="container">
                    <h1 class="logo-font">conduit</h1>
                    <p>A place to share your knowledge.</p>
                </div>
            </div>
        `
    }
}
customElements.define('real-banner', RealBanner);

export {RealBanner}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
        h1 {
            line-height: 1.1;
        }
        
        .banner {
            background: #5cb85c;
            color: #fff;
            box-shadow: inset 0 8px 8px -8px rgba(0, 0, 0, .3), inset 0 -8px 8px -8px rgba(0, 0, 0, .3);
            padding: 2rem; 
        }
        
        .banner p {
            color: #fff;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 300 !important;
            margin-bottom: 0
        }
        
        .banner h1 {
            text-shadow: 0 1px 3px rgba(0, 0, 0, .3);
            font-weight: 700 !important;
            text-align: center;
            font-size: 3.5rem;
            padding-bottom: .5rem
        }
        
        .logo-font {
            font-family: titillium web, sans-serif
        }
                
    </style>`;
}


// .feed-toggle {
//     margin-bottom: -1px
// }
//
// .sidebar {
//     padding: 5px 10px 10px;
//     background: #f3f3f3;
//     border-radius: 4px
// }
//
// .sidebar p {
//     margin-bottom: .2rem
// }