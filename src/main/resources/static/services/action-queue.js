import {apiRegisterUser, apiLoginUser, apiFavorite, apiUnfavorite} from "./api.js";
import {currentUser, store} from "./store.js";

class ActionQueue {
    constructor() {
        this.queue = [];
        this.timerId = setInterval(this.run, 100);
        // this.router = document.querySelector('real-router');
        // console.log('action-queue::constructor(): this.router:', this.router);
        this.navbar = document.querySelector('real-navbar');
        console.log('action-queue::constructor(): this.navbar:', this.navbar);

        this.actionExecutor = {
            'register-user': this.registerUserAction,
            'login': this.loginAction,
            'route': this.routeAction,
            'favorite': this.favoriteAction,
            'unfavorite': this.unfavoriteAction,
        }
    }

    addAction(action) {
        this.queue.push(action);
    }

    run = async () => {
        if (this.queue.length === 0) return;

        const action = this.queue.pop();
        console.log('action-queue::run(): action:', action);

        const executor = this.actionExecutor[action.type];
        if (!executor) return;

        const result = await executor(action.data);
        action.nextRoute && this.routeAction({name: action.nextRoute});
        action.callback && action.callback(result);
    }



    registerUserAction = async (data) => {
        const json = await apiRegisterUser(data);
        console.log('action-queue::registerUserAction(): json:', json);
        store.set('user', json.user);
    }

    loginAction = async (data) => {
        const json = await apiLoginUser(data);
        console.log('action-queue::loginAction(): json:', json);
        store.set('user', json.user);
    }

    logoutAction = () => {
        store.remove('user');
    }

    routeAction = (data) => {
        console.log('action-queue::routeAction(): this.navbar:', this.navbar);
        if (!this.navbar) return;

        this.navbar.setCurrentLink(data.name);
    }

    checkAuth() {
        const user = currentUser();
        if (!user)
            throw Error('login first');
    }

    favoriteAction = async (data) => {
        console.log('action-queue::favoriteAction(): data:', data);
        this.checkAuth();

        const result = await apiFavorite(data.name);
        console.log('action-queue::favoriteAction(): result:', result);

        return result.article;
    }

    unfavoriteAction = async (data) => {
        console.log('action-queue::unfavoriteAction(): data:', data);
        this.checkAuth();

        const result = await apiUnfavorite(data.name);
        console.log('action-queue::unfavoriteAction(): result:', result);

        return result.article;
    }
}

const actionQueue = new ActionQueue();
export {actionQueue}
