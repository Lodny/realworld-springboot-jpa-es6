import {store} from "./store.js";

const BASE_URL = 'api';

const initHeaders = () => {
    const headers = new Map();
    const user = store.get("user");
    if (user)
        headers.set('Authorization', 'Token ' + user.token);

    console.log('api::initHeaders(): headers:', headers);

    return headers;
}

const apiGet = (url) => {
    console.log('api::get(): BASE_URL + url:', BASE_URL + url);

    const headers = initHeaders();
    return fetch(BASE_URL + url, {headers})
        .then(response => response.json())
        .catch(error => console.log('[E] api::apiGet():', error));

    // try {
    //     const response = await fetch(BASE_URL + url, {headers});
    //     console.log('api::apiGet(): response:', response);
    //
    //     return response.json();
    // } catch (e) {
    //     console.log('[E] api::apiGet(): e:', e);
    // }
}

const apiPost = (url, data, token = null) => {
    console.log('api::post(): BASE_URL + url:', BASE_URL + url);

    const headers = initHeaders();
    headers.set('Content-Type', 'application/json');
    return fetch(BASE_URL + url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => console.log('[E] api::apiPost():', error));
}

const apiDelete = (url, data, token = null) => {
    console.log('api::apiDelete(): BASE_URL + url:', BASE_URL + url);

    const headers = initHeaders();
    return fetch(BASE_URL + url, {
        method: 'DELETE',
        headers,
    })
        .then(response => response.json())
        .catch(error => console.log('[E] api::apiDelete():', error));
}



class RealApi {
    constructor() {
    }

    registerUser = (data) => {
        return apiPost('/users', {user: data});
    }

    loginUser = (data) => {
        return apiPost('/users/login', {user: data});
    }

    favorite = (slug) => {
        return apiPost(`/articles/${slug}/favorite`, {});
    }

    unfavorite = (slug) => {
        return apiDelete(`/articles/${slug}/favorite`, {});
    }

    getProfile = (username) => {
        return apiGet(`/profiles/${username}`);
    }

    follow = (username) => {
        return apiPost(`/profiles/${username}/follow`, {});
    }

    unfollow = (username) => {
        return apiDelete(`/profiles/${username}/follow`, {});
    }

    registerArticle = (article) => {
        return apiPost(`/articles`, {article});
    }

    getArticles = (param) => {
        const {
            tag,
            author,
            favorited,
            offset = 0,
            limit = 20,
        } = param;
        console.log('api::realApi.getArticles(): param:', param);

        console.log('api::realApi.getArticles(): tag:', tag);
        console.log('api::realApi.getArticles(): author:', author);
        console.log('api::realApi.getArticles(): favorited:', favorited);

        console.log('api::realApi.getArticles(): offset:', offset);
        console.log('api::realApi.getArticles(): limit:', limit);

        let url = `/articles?offset=${offset}&limit=${limit}`;
        if (tag)
            return apiGet(url + `&tag=${tag}`);
        else if (author)
            return apiGet(url + `&author=${author}`);
        else if (favorited)
            return apiGet(url + `&favorited=${favorited}`);

        return apiGet(`/articles?offset=${offset}&limit=${limit}`);
    }

    deleteArticle = (slug) => {
        return apiDelete(`/articles/${slug}`, {});
    }

    getComments = (slug) => {
        return apiGet(`/articles/${slug}/comments`);
    }

    addComment = (slug, data) => {
        return apiPost(`/articles/${slug}/comments`, {comment: {body: data}});
    }

    deleteComment = (slug, id) => {
        return apiDelete(`/articles/${slug}/comments/${id}`, {});
    }

    getTop10Tags = () => {
        return apiGet(`/tags`);
    }
}
const realApi = new RealApi();
export {realApi}
