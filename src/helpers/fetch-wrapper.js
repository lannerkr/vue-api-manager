import { useAuthStore } from '@/stores';

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        //console.log(fetch(url, requestOptions).then(handleResponse))
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const authStore = useAuthStore()
    const isLoggedIn = (authStore.userinfo.jwtToken != null)
    const isApiUrl = url.startsWith(config.VUE_CONFIG_APP_API);
    //console.log("Fetchwrapper token:"+authStore.userinfo.jwtToken+" , isLoggedIn: "+isLoggedIn+" , isApiUrl: "+isApiUrl)
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${authStore.userinfo.jwtToken}` };
    } else {
        return {};
    }
}

async function handleResponse(response) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;
    // check for error response
    if (!response.ok) {
        const authStore = useAuthStore()
        if ([401, 403].includes(response.status) && authStore.userinfo.jwtToken) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            authStore.logout();
        }

        // get error message from body or default to response status
        let responseText = await response.text();
        const error = (data && data.message) || responseText || response.status;
        return Promise.reject(error);
    }

    return data;
}
