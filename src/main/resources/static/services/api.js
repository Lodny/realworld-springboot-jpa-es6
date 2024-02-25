import {store} from "./store.js";

const BASE_URL = 'api';

function initHeaders() {
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



const apiRegisterUser = (data) => {
    return apiPost('/users', {user: data});
}

const apiLoginUser = (data) => {
    return apiPost('/users/login', {user: data});
}

const apiFavorite = (slug) => {
    return apiPost(`/articles/${slug}/favorite`, {});
}

const apiUnfavorite = (slug) => {
    return apiDelete(`/articles/${slug}/favorite`, {});
}

const apiGetProfile = (username) => {
    return apiGet(`/profiles/${username}`);
}

const apiFollow = (username) => {
    return apiPost(`/profiles/${username}/follow`, {});
}

const apiUnfollow = (username) => {
    return apiDelete(`/profiles/${username}/follow`, {});
}

const apiRegisterArticle = (article) => {
    return apiPost(`/articles`, {article});
}

const apiGetArticles = (param) => {
    const {
        tag,
        author,
        favorited,
        offset = 0,
        limit = 20,
    } = param;
    console.log('api::apiGetArticles(): param:', param);

    console.log('api::apiGetArticles(): tag:', tag);
    console.log('api::apiGetArticles(): author:', author);
    console.log('api::apiGetArticles(): favorited:', favorited);

    console.log('api::apiGetArticles(): offset:', offset);
    console.log('api::apiGetArticles(): limit:', limit);

    let url = `/articles?offset=${offset}&limit=${limit}`;
    if (tag)
        return apiGet(url + `&tag=${tag}`);
    else if (author)
        return apiGet(url + `&author=${author}`);
    else if (favorited)
        return apiGet(url + `&favorited=${favorited}`);

    return apiGet(`/articles?offset=${offset}&limit=${limit}`);
}

const apiDeleteArticle = (slug) => {
    return apiDelete(`/articles/${slug}`, {});
}

const apiGetComments = (slug) => {
    return apiGet(`/articles/${slug}/comments`);
}

const apiAddComment = (slug, data) => {
    return apiPost(`/articles/${slug}/comments`, {comment: {body: data}});
}

const apiDeleteComment = (slug, id) => {
    return apiDelete(`/articles/${slug}/comments/${id}`, {});
}

const apiGetTop10Tags = () => {
    return apiGet(`/tags`);
}

export {
    apiRegisterUser
    , apiLoginUser
    , apiRegisterArticle
    , apiGetArticles
    , apiDeleteArticle
    , apiFavorite
    , apiUnfavorite
    , apiGetProfile
    , apiFollow
    , apiUnfollow
    , apiGetComments
    , apiAddComment
    , apiDeleteComment
    , apiGetTop10Tags
}
