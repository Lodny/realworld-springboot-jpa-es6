import {store} from "./store.js";

const BASE_URL = 'api';


function makeHeaders() {
    const headers = new Map();
    const user = store.get("user");
    if (user)
        headers.set('Authorization', 'Token ' + user.token);

    console.log('api::makeHeaders(): headers:', headers);

    return headers;
}

const apiGet = (url) => {
    console.log('api::get(): BASE_URL + url:', BASE_URL + url);

    const headers = makeHeaders();
    return fetch(BASE_URL + url, {headers})
        .then(response => response.json())
        .catch(error => console.log('[E] api::apiGet():', error));
}

const apiPost = (url, data, token = null) => {
    console.log('api::post(): BASE_URL + url:', BASE_URL + url);

    const headers = makeHeaders();
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

    const headers = makeHeaders();
    return fetch(BASE_URL + url, {
        method: 'DELETE',
        headers,
    })
        .then(response => response.json())
        .catch(error => console.log('[E] api::apiDelete():', error));
}



const registerUser = (data) => {
    return apiPost('/users', {user: data});
}

const loginUser = (data) => {
    return apiPost('/users/login', {user: data});
}

const favorite = (slug) => {
    return apiPost(`/articles/${slug}/favorite`, {});
}

const unfavorite = (slug) => {
    return apiDelete(`/articles/${slug}/favorite`, {});
}



const getGlobalArticles = () => {
    return apiGet('/articles?offset=0&limit=20');
}



export {
    registerUser
    , loginUser
    , getGlobalArticles
    , favorite
    , unfavorite
}
