// API LAYER -> used for communicating with the backend b calling api through function

import axios from 'axios';

// creating baseURL for api
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})

// functions for calling api
export async function register({ username, email, password }) {
    
    //
    const response = await api.post('/api/auth/register', {
        email,
        username,
        password
    })

    return response.data;
}

export async function login({ username, email, password}) {
    
    // send credentials in the request body
    const response = await api.post('/api/auth/login', {
        email,
        username,
        password
    });
    return response.data;
}

export async function getMe() {

    //
    const response = await api.get('/api/auth/get-me');
    return response.data;
}

export async function logout() {

    //
    const response = await api.get('/api/auth/logout');
    return response.data;
}
