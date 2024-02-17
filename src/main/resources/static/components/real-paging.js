class RealPaging extends HTMLElement {

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
            
            <ul class="pagination">
                <li class="page-item active">
                    <a class="page-link" href="">1</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="">2</a>
                </li>
            </ul>
        `
    }
}
customElements.define('real-paging', RealPaging);
export {RealPaging}

function style() {
    return `
        <link rel="stylesheet" href="../css/common.css">

        <style>
            .pagination {
                display: inline-block;
                padding-left: 0;
                margin-top: 1rem;
                margin-bottom: 1rem;
                border-radius: .25rem
            }
            
            .page-item {
                display: inline
            }
            
            .page-item:first-child .page-link {
                margin-left: 0;
                border-bottom-left-radius: .25rem;
                border-top-left-radius: .25rem
            }
            
            .page-item:last-child .page-link {
                border-bottom-right-radius: .25rem;
                border-top-right-radius: .25rem
            }
            
            .page-item.active .page-link, .page-item.active .page-link:focus, .page-item.active .page-link:hover {
                z-index: 2;
                color: #fff;
                cursor: default;
                background-color: #5cb85c;
                border-color: #5cb85c
            }
            
            .page-item.disabled .page-link, .page-item.disabled .page-link:focus, .page-item.disabled .page-link:hover {
                color: #818a91;
                pointer-events: none;
                cursor: not-allowed;
                background-color: #fff;
                border-color: #ddd
            }
            
            .page-link {
                position: relative;
                float: left;
                padding: .5rem .75rem;
                margin-left: -1px;
                color: #5cb85c;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #ddd
            }
            
            .page-link:focus, .page-link:hover {
                color: #3d8b3d;
                background-color: #eceeef;
                border-color: #ddd
            }            
                    
        </style>`;
}
