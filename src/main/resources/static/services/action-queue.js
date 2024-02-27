import {realApi} from "./api.js";
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

        this.alertTag = document.querySelector('real-alert');

        this.actionExecutor = {
            'registerUser': this.registerUserAction
            , 'login': this.loginAction
            , 'route': this.routeAction
            , 'logout': this.logoutAction
            , 'getProfile': this.getProfile
            , 'favorite': this.favoriteAction
            , 'unfavorite': this.unfavoriteAction
            , 'follow': this.followAction
            , 'unfollow': this.unfollowAction
            , 'updateUser': this.updateUser
            , 'registerArticle': this.registerArticle
            , 'getArticles': this.getArticles
            , 'deleteArticle': this.deleteArticle
            , 'addComment': this.addComment
            , 'getComments': this.getComments
            , 'deleteComment': this.deleteComment
            , 'tags': this.getTags
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

        const data = await executor(action.data);
        console.log('action-queue::run(): data:', data);

        if (!this.checkError(data)) {
            await this.alertTag.alert(data.message);
            action.callback && action.callback({type: "error", result: data.message});
            return;
        }

        action.set && store.set(action.set, data[action.set]);
        action.nextRoute && this.routeAction({value: action.nextRoute});
        const result = Object.values(data)[0];
        action.callback && action.callback({type: action.type, result, data});
        this.runNotify(action, result);
    }

    checkError(result) {
        if (!result) return true;
        if (!result.message) return true;

        return false;
    }

    runNotify(action, result) {
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

    registerUserAction = async (user) => {
        return await realApi.registerUser(user);
    }

    loginAction = async (user) => {
        return await realApi.loginUser(user);
    }

    logoutAction = () => {
        store.delete('user');
    }

    routeAction = ({value}) => {
        console.log('action-queue::routeAction(): this.navbar:', this.navbar);
        if (!this.navbar) return;

        this.navbar.setCurrentLink(value);
    }

    getProfile = async ({value: username}) => {
        console.log('action-queue::getProfile(): username:', username);
        return await realApi.getProfile(username);
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

        return await realApi.favorite(slug);
    }

    unfavoriteAction = async ({value: slug}) => {
        console.log('action-queue::unfavoriteAction(): slug:', slug);

        if (!this.checkFavoriteAction(slug)) return;

        return realApi.unfavorite(slug);
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

        return await realApi.follow(username);
    }

    registerArticle = async ({value: article}) => {
        console.log('action-queue::registerArticle(): article', article);
        this.checkAuth();

        return await realApi.registerArticle(article);
    }

    getArticles = async ({value: param}) => {
        console.log('action-queue::getArticles(): param:', param);

        return await realApi.getArticles(param);
    }

    unfollowAction = async ({value: username}) => {
        console.log('action-queue::unfollowAction(): username:', username);
        if (!this.checkFollowAction(username)) return;

        return await realApi.unfollow(username);
    }

    updateUser = async (user) => {
        console.log('action-queue::updateUser(): user:', user);
        this.checkAuth();

        return await realApi.updateUser(user);
    }

    deleteArticle = async ({value: slug}) => {
        console.log('action-queue::deleteArticle(): slug:', slug);
        this.checkAuth();

        return await realApi.deleteArticle(slug);
    }

    addComment = async ({slug, value: body}) => {
        console.log('action-queue::addComment(): slug, value:', slug, body);
        this.checkAuth();

        const result = await realApi.addComment(slug, body);
        if (! result.message) {
            const comments = store.get('comments');
            store.set('comments', [result.comment, ...comments]);
        }

        return result;
    }

    getComments = async ({value: slug}) => {
        console.log('action-queue::addComment(): slug:', slug);

        return await realApi.getComments(slug);
    }

    deleteComment = async ({slug, value: id}) => {
        console.log('action-queue::deleteComment(): slug, id:', slug, id);
        this.checkAuth();

        const result = await realApi.deleteComment(slug, id);
        if (! result.message) {
            const comments = store.get('comments').filter(comment => comment.id !== Number(id));
            store.set('comments', comments);
        }

        return result;
    }

    getTags = async () => {
        return await realApi.getTop10Tags();
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
