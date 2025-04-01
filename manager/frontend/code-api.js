
const API_BASE = 'https://api.sweaver.ca/code-auth/';

const endpoints = {
    signup: `${API_BASE}/signup`,
    deleteCode: `${API_BASE}/delete-code/`,
    validCode: `${API_BASE}/valid-code/`
};

async function sendRequest(url, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const response = await fetch(url, {
            method,
            headers,
            credentials: 'include',
            body: body ? JSON.stringify(body) : null
        });

        if (!response.ok) {
            throw new Error(`request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('request error:', error);
        return { error: error.message };
    }
}

export async function signup(formData) {
    console.log(formData);
    const response = await sendRequest(endpoints.signup, 'POST', formData);
    console.log('signup response:', response);
    return response;
}

export async function validCode(code) {
    const response = await sendRequest(`${endpoints.validCode}${code}`, 'GET');
    console.log('response:', response);
    return response;
}

export async function deleteCode(code) {
    const response = await sendRequest(`${endpoints.deleteCode}${code}`, 'GET');
    console.log('response:', response);
    return response;
}