// hooks layer -> 

import { register, login, getMe, logout } from '../services/auth.api';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';

export const useAuth = () => {

    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    async function handleRegister({username, email, password}) {
        setLoading(true);
        const data = await register({username, email, password});
        setUser(data.user);
        setLoading(false);
    }

    async function handleLogin({ email, password}) {
        setLoading(true);
        const data = await login({ email, password});
        setUser(data.user);
        setLoading(false);
    }

    async function handleGetMe() {
        setLoading(true);
        const data = await getMe();
        setUser(data.user);
        setLoading(false);
    }

    async function handleLogout() {
        setLoading(true);
        const data = await logout();
        setUser(null);
        setLoading(false);
    }

    // iterating user again for preveserving the value of user value (setUser), we call handleGetMe() 
    // fn which sets users again by calling getMe() api again and sets loading state as false
    // this helps in logged in of the user even on the page refresh
    useEffect(() => {
        handleGetMe();
    },[])

    return ({
        user,
        loading, 
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    })


}
 