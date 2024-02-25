import {
    apiRegisterUser,
    apiLoginUser,
    apiFavorite,
    apiUnfavorite,
    apiFollow,
    apiUnfollow,
    apiDeleteComment,
    apiAddComment,
    apiRegisterArticle,
    apiDeleteArticle,
    apiGetTop10Tags
} from "./api.js";
import {currentUser, store} from "./store.js";

class ActionQueue {
    constructor() {
        this.actionQueue = [];
        this.listenerMap = new Map();

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
            'registerArticle': this.registerArticle,
            'deleteArticle': this.deleteArticle,
            'addComment': this.addComment,
            'deleteComment': this.deleteComment,
            'logout': this.logout,
            'tags': this.getTags,
        }
    }

    addAction(action) {
        this.actionQueue.push(action);
    }

    run = async () => {
        if (this.actionQueue.length === 0) return;

        const action = this.actionQueue.pop();
        console.log('action-queue::run(): action:', action);

        const executor = this.actionExecutor[action.type];
        if (!executor) return;

        const result = await executor(action.data);
        action.nextRoute && this.routeAction({value: action.nextRoute});
        action.callback && action.callback({type: action.type, result});
        action.notify && this.listenerMap
            .get(action.notify)
            ?.forEach(listener => {
                console.log('action-queue::noMethod(): listener:', listener);
                listener?.callback({type: action.type, result});
            });
    }

    addListener(key, tags) {
        const listeners = this.listenerMap.get(key) ?? [];
        listeners.push(...(Array.isArray(tags) ? tags : [tags]));
        this.listenerMap.set(key, listeners);

        console.log('action-queue::addListener(): key, this.listenerMap.get(key):', key, this.listenerMap.get(key));
    }

    removeListener(key, tags) {
        tags = (Array.isArray(tags) ? tags : [tags]);

        let listeners = this.listenerMap.get(key) ?? [];
        listeners = listeners.filter(listener => !tags.includes(listener));
        this.listenerMap.set(key, listeners);

        console.log('action-queue::removeListener(): listeners:', listeners);
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

        this.navbar.setCurrentLink(data.value);
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

    favoriteAction = async ({value: slug}) => {
        console.log('action-queue::favoriteAction(): slug:', slug);

        if (!this.checkFavoriteAction(slug)) return;

        const result = await apiFavorite(slug);
        console.log('action-queue::favoriteAction(): result:', result);

        return result.article;
    }

    unfavoriteAction = async ({value: slug}) => {
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

    followAction = async ({value: username}) => {
        console.log('action-queue::followAction(): username:', username);

        if (!this.checkFollowAction(username)) return;

        const result = await apiFollow(username);
        console.log('action-queue::followAction(): result:', result);

        return result.profile;
    }

    registerArticle = async ({value: article}) => {
        console.log('action-queue::registerArticle(): article', article);
        this.checkAuth();

        const data = await apiRegisterArticle(article);
        console.log('action-queue::registerArticle(): data.article:', data.article);

        return data.article;
    }

    unfollowAction = async ({value: username}) => {
        console.log('action-queue::unfollowAction(): username:', username);
        if (!this.checkFollowAction(username)) return;

        const result = await apiUnfollow(username);
        console.log('action-queue::unfollowAction(): result:', result);

        return result.profile;
    }

    deleteArticle = async ({value: slug}) => {
        console.log('action-queue::deleteArticle(): slug:', slug);
        this.checkAuth();

        return await apiDeleteArticle(slug);
    }

    addComment = async ({slug, value: body}) => {
        console.log('action-queue::addComment(): slug, value:', slug, body);
        this.checkAuth();

        const data = await apiAddComment(slug, body);
        const comments = store.get('comments');
        store.set('comments', [data.comment, ...comments]);

        return data.comment;
    }

    deleteComment = async ({slug, value: id}) => {
        console.log('action-queue::deleteComment(): slug, id:', slug, id);
        this.checkAuth();

        const count = await apiDeleteComment(slug, id);
        const comments = store.get('comments').filter(comment => comment.id !== Number(id));
        store.set('comments', comments);

        return count;
    }

    logout = () => {
        console.log('action-queue::logout(): ');

        store.delete('user');
    }

    getTags = async () => {
        const data = await apiGetTop10Tags();
        console.log('action-queue::getTags(): data:', data);
        return data?.tags;
    }
}

const actionQueue = new ActionQueue();

const addGoAction = (routeName) => {
    actionQueue.addAction({
        type: 'route',
        data: {
            value: routeName,
        },
    });
}

export {
    actionQueue
    , addGoAction
}
