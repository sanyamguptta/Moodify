import React from 'react'
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router';

// Protected component is a wrapper that allows only logged-in users to access a route and redirects unauthenticated users directly to the login page.
const Protected = ({ children }) => {

    const { user, loading } = useAuth();

    const navigate = useNavigate();

    if (loading) {
      return <h1>loading...</h1>;
    }

    // if both state is not loading and user is not logged in then redirect to login page
    if(!user) {
        return <Navigate to='/login' />
    }

  return children;
}

export default Protected