import {EditorPage} from "../pages/editor-page.js";
import {SettingsPage} from "../pages/settings-page.js";
import {ProfilePage} from "../pages/profile-page.js";

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
        this.go(this.routes[0]);
    }

    go(route) {
        console.log('real-router::go(): route:', route);

        this.active = route;
        console.log('real-router::go(): this.active:', this.active);

        this.render();
    }

    getCurrentTagString() {
        const className = this.active.element.name;
        const tagName = className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

        const pathName = `pathName="${this.active.pathName ?? ''}"`
        console.log('real-router::getCurrentTagString(): pathName:', pathName);

        return `<${tagName} ${pathName}></${tagName}>`;
    }

    render() {
        if (!this.active) return;
        console.log('real-router::render(): this.active.element.name:', this.active.element.name);

        this.shadow.innerHTML = this.getCurrentTagString();
        console.log('real-router::render(): this.shadow.innerHTML:', this.shadow.innerHTML);
    }
}
customElements.define('real-router', RealRouter);

export {RealRouter}
