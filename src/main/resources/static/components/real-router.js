class RealRouter extends HTMLElement {

    constructor() {
        super();

        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    setRoutes(routeInfo) {
        console.log('real-router::setRoutes(): routeInfo:', routeInfo);
        this.routes = routeInfo.routes;
        this.go(routeInfo.active);
    }

    go(name) {
        console.log('real-router::go(): name:', name);
        this.active = this.routes.find(r => r.name === name);
        console.log('real-router::go(): this.active:', this.active);

        this.render();
    }

    getCurrentTagString() {
        const className = this.active.element.name;
        const tagName = className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return `<${tagName}></${tagName}>`;
    }

    render() {
        if (!this.active) return;
        console.log('real-router::render(): this.active.element.name:', this.active.element.name);

        this.shadow.innerHTML = this.getCurrentTagString();
    }
}
customElements.define('real-router', RealRouter);

export {RealRouter}
