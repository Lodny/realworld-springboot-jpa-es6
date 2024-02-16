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
    const user = await post('/users', {user: data});
    console.log('api::registerUser(): user:', user);
    return user;
}


export {
    registerUser
}
