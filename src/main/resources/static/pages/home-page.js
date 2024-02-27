import {RealBanner} from '../components/real-banner.js'
import {RealTab} from '../components/real-tab.js'
import {RealSidebar} from '../components/real-sidebar.js'
import {iconCdn} from "../services/icon-cdn.js";
import {currentUser, store} from "../services/store.js";
import {actionQueue} from "../services/action-queue.js";

const style = `<style>

</style>`;

const getTemplate = (tabTitles, activeTab) => {
    return `
        ${iconCdn}
        <link rel="stylesheet" href="../css/common.css">
        ${style}
        
        <div class="home-page">
            <real-banner></real-banner>            
        
            <div class="container page">
                <div class="row">
                    <real-tab class="col-md-9" tab-titles="${tabTitles}" active-tab="${activeTab}">
                        <div class="articles"></div>
                        <real-paging></real-paging>
                    </real-tab>
                    <real-sidebar class="col-md-3"></real-sidebar>
                </div>
            </div>
        </div>       
    `;
}

class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const [tabTitles, activeTab] = this.getTabTitles();
        this.activeTab = activeTab;
        this.shadowRoot.innerHTML = getTemplate(tabTitles, activeTab);

        this.findElements();
        this.setEventHandler();
    }

    getTabTitles(tagName) {
        let activeTab = 'Global Feed';
        let tabTitles = [activeTab];

        const user = currentUser();
        if (user)
            tabTitles = ['Your Feed', ...tabTitles];

        if (tagName) {
            activeTab = `#${tagName}`;
            tabTitles = [...tabTitles, activeTab];
        }

        return [tabTitles, activeTab];
    }

    async connectedCallback() {
        this.getArticles(this.activeTab);
    }

    findElements() {
        this.tabTag = this.shadowRoot.querySelector('real-tab');
        this.sidebarTag = this.shadowRoot.querySelector('real-sidebar');
        this.articlesTag = this.shadowRoot.querySelector('.articles');
        this.pagingTag = this.shadowRoot.querySelector('real-paging');
        console.log('home-page::findElements(): this.sidebarTag:', this.sidebarTag);
    }

    setEventHandler() {
        console.log('home-page::setEventHandler(): 1:', 1);
        this.tabTag?.setCallback(this.tabEventHandler);
        this.sidebarTag?.setCallback(this.tagEventHandler);
    }

    tabEventHandler = async (activeTab) => {
        console.log('home-page::tabEventHandler(): activeTab:', activeTab);

        const existTagTab = this.tabTag
            .getAttribute('tab-titles').split(',')
            .findIndex(title => title.startsWith('#')) >= 0;

        if (existTagTab && !activeTab.startsWith('#')) {
            console.log('home-page::tabEventHandler(): existTagTab:', existTagTab);
            const [tabTitles, activeTab] = this.getTabTitles();
            this.tabTag.setAttribute('tab-titles', tabTitles);
        }

        this.getArticles(activeTab);
    }

    tagEventHandler = (tagName) => {
        console.log('home-page::tagEventHandler(): tagName:', tagName);
        const [tabTitles, activeTab] = this.getTabTitles(tagName);
        this.tabTag.setAttribute('tab-titles', tabTitles);
        this.tabTag.setAttribute('active-tab', activeTab);
    }

    callback = ({type, result, data}) => {
        console.log('home-page::callback(): type, result', type, result);

        if (type === 'getArticles') {
            this.updateArticles(result);
            console.log('home-page::callback(): data:', data);

            this.pagingTag.setPageCount(data.totalPages);
            this.pagingTag.setCurrentPage(data.number);
        }
    }

        render() {
    }

    updateArticles(articles) {
        const activeTab = this.tabTag.getAttribute('active-tab');
        console.log('home-page::updateArticles(): activeTab:', activeTab);

        this.articlesTag.innerHTML = articles
            ?.map(article => `<real-article-preview slug="${article.slug}"></real-article-preview>`)
            .join('')
    }

    getArticles(activeTab) {
        let param = {};
        if (activeTab === 'Global Feed') {

        } else if (activeTab === 'Your Feed') {
            const user = currentUser();
            param = {author: user.username}
        } else {
            param = {tag: activeTab.slice(1)}
        }

        actionQueue.addAction({
            type: 'getArticles',
            data: {
                value: param,
            },
            set: 'articles',
            callback: this.callback,
        })
    }
}
customElements.define('home-page', HomePage);
export {HomePage}
