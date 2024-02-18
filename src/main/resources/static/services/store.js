class Store {
    constructor() {
        this.store = new Map();
        this.store.set('articles', []);
    }

    add(name, data) {
        this.store.set(name, data);
        console.log('store::addItem(): this.store:', this.store);
    }

    remove(name) {
        this.store.delete(name);
        console.log('store::remove(): this.store:', this.store);
    }

    get(name) {
        return this.store.get(name);
    }

    addArticles(data) {
        console.log('store::addArticles(): data:', data);
        this.store['articles'] = data.articles;
    }

    getArticle(slug) {
        return this.store['articles'].find(article => article.slug === slug);
    }
}

const store = new Store();

export {store}
