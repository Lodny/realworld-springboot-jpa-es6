const BASE_URL = 'api';

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


export {
    registerUser
    , loginUser
}
