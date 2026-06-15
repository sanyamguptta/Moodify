// for API layer 
import axios from 'axios';

// creating a base url for axios api calling
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})


// code for interacting with the backend api
export async function register({ username, email, password }) {

    const response = await api.post('/api/auth/register', {
        username,
        email, 
        password
    })

    return response.data;
}

export async function login({email, password }) {

    const response = await api.post('/api/auth/login', {
        email, 
        password
    })

    return response.data;
}

export async function getMe() {

    const response = await api.get('/api/auth/get-me');
    return response.data;
}

export async function logout() {

    const response = await api.get('/api/auth/logout');
    return response.data;
}