const BASE_URL = 'api';


const get = (url) => {
    console.log('api::get(): BASE_URL + url:', BASE_URL + url);

    return fetch(BASE_URL + url)
        .then(response => response.json())
        .catch(error => console.log('[E] api::post():', error));
}

const post = (url, data, token = null) => {
    console.log('api::post(): BASE_URL + url:', BASE_URL + url);

    return fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => console.log('[E] api::post():', error));
}



const registerUser = async (data) => {
    return await post('/users', {user: data});
}

const loginUser = async (data) => {
    return await post('/users/login', {user: data});
}



const getGlobalArticles = async () => {
    return await get('/articles?offset=0&limit=20');
}



export {
    registerUser
    , loginUser
    , getGlobalArticles
}
