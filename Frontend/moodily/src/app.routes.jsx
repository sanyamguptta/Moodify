/**
 * USING REACT-ROUTER FOR CREATING: 
 *  /login: for login page
 *  /register: for register page
 */

import {createBrowserRouter} from 'react-router';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/Protected';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Protected><h1>Home</h1></Protected> // rendering protected route as home
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    }
])
