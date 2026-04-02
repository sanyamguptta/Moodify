// HOOK'S LAYER -> for managing state and api layer

import { register, login, getMe, logout } from '../services/auth.api';
// for making custom hook
import { useContext } from 'react';
// for 
import { AuthContext } from '../auth.context';

export const useAuth() => {

    // extracting state variables and function using AuthContect
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    //
    async function handleRegister({ username, email, password }) {
        
        setLoading(true);
        // calling register() function for storing response
        const data = await register({ username, email, password });
        // setting user in state variable for updating state 
        setUser(data.user)
        setLoading(false);
    }

    async function handleLogin( { username, email, password }) {
        
        // setting laoding as true untill response comes
        setLoading(true);
        // calling login() function for storing response & setting response in state variable
        const data = await login({ username, email, password });
        setUser(data.user);
        // setting back to false
        setLoading(false);
    }

    async function handleGetMe() {

        // setting laoding as true untill response comes
        setLoading(true);
        // calling getMe() function for storing response & setting response in state variable
        const data = await getMe();
        setUser(data.user);
        // setting back to false
        setLoading(false);
    }

    async function handleLogout() {

        //
        setLoading(true);
        // calling getMe() function for storing response & setting response in state variable
        const data = await logout();
        setUser(null);
        // setting back to false
        setLoading(false);
    }

// now, we can access these 6 paramters anywhere through useAuth() hook
return {
    user, 
    loading,
    handleRegister, 
    handleLogin,
    handleGetMe, 
    handleLogout
}

}


