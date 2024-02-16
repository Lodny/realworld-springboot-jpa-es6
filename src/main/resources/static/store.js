class Store {
    constructor() {
        this.store = new Map();
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
}

const store = new Store();

export {store}
