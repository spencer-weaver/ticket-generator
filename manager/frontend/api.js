
const API_BASE = 'https://api.sweaver.ca/auth/';

const endpoints = {
    signup: `${API_BASE}/signup`,
    signin: `${API_BASE}/signin`,
    refreshToken: `${API_BASE}/refresh_token`,
    logout: `${API_BASE}/logout`,
    protected: `${API_BASE}/protected`
};

async function sendRequest(url, method = 'GET', body = null, includeAuth = false) {
    const headers = { 'Content-Type': 'application/json' };
    
    if (includeAuth) {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token is missing');
            return { error: 'No access token' };
        }
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(url, {
            method,
            headers,
            credentials: 'include',
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Request error:', error);
        return { error: error.message };
    }
}

export async function signup(formData) {
    const response = await sendRequest(endpoints.signup, 'POST', formData);
    console.log('signup response:', response);
    return response;
}

export async function signin(formData) {
    const response = await sendRequest(endpoints.signin, 'POST', formData);
    if (response.accesstoken) {
        localStorage.setItem('accessToken', response.accesstoken);
    }
    console.log('signin response:', response);
    return response;
}

export async function refreshToken() {
    const response = await sendRequest(endpoints.refreshToken, 'POST');
    if (response.error) {
        localStorage.removeItem('accessToken');
    }
    console.log('refresh token response:', response);
    return response;
}

export async function fetchProtected() {
    const response = await sendRequest(endpoints.protected, 'GET', null, true);
    console.log('protected response:', response);
    return response;
}

export async function logout() {
    const response = await sendRequest(endpoints.logout, 'POST');
    if (response.type === 'success') {
        localStorage.removeItem('accessToken');
    }
    console.log('Logout response:', response);
    return response;
}