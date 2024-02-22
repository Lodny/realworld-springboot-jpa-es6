import {apiRegisterUser, apiLoginUser, apiFavorite, apiUnfavorite, apiFollow, apiUnfollow} from "./api.js";
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
            'follow': this.followAction,
            'unfollow': this.unfollowAction,
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
        action.callback && action.callback({type: action.type, result});
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

        return user;
    }

    checkFavoriteAction = (slug) => {
        const user = currentUser();

        if (!user) {
            addGoAction('/login');
            return false;
        }

        const article = store.getArticle(slug);
        if (article.author.username === user.username) {
            console.log('action-queue::favoriteAction(): article.author.username === user.username');
            return false;
        }

        return true;
    }

    favoriteAction = async ({name: slug}) => {
        console.log('action-queue::favoriteAction(): slug:', slug);

        if (!this.checkFavoriteAction(slug)) return;

        const result = await apiFavorite(slug);
        console.log('action-queue::favoriteAction(): result:', result);

        return result.article;
    }

    unfavoriteAction = async ({name: slug}) => {
        console.log('action-queue::unfavoriteAction(): slug:', slug);

        if (!this.checkFavoriteAction(slug)) return;

        const result = await apiUnfavorite(slug);
        console.log('action-queue::unfavoriteAction(): result:', result);

        return result.article;
    }

    checkFollowAction = (username) => {
        const user = currentUser();

        if (!user) {
            addGoAction('/login');
            return false;
        }

        if (username === user.username) {
            console.log('action-queue::followAction(): username === user.username');
            return false;
        }

        return true;
    }

    followAction = async ({name: username}) => {
        console.log('action-queue::followAction(): username:', username);

        if (!this.checkFollowAction(username)) return;

        const result = await apiFollow(username);
        console.log('action-queue::followAction(): result:', result);

        return result.profile;
    }

    unfollowAction = async ({name: username}) => {
        console.log('action-queue::unfollowAction(): username:', username);
        if (!this.checkFollowAction(username)) return;

        const result = await apiUnfollow(username);
        console.log('action-queue::unfollowAction(): result:', result);

        return result.profile;
    }
}

const actionQueue = new ActionQueue();

const addGoAction = (routeName) => {
    actionQueue.addAction({
        type: 'route',
        data: {
            name: routeName,
        },
    });
}

export {
    actionQueue
    , addGoAction
}
