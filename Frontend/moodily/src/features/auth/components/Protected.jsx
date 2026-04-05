import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from "react-router";

const Protected = ({ children }) => {

  // extracting loading and user property from useAuth()
  const { user, loading } = useAuth();

  // calling useNavigate()
  const navigate = useNavigate();

  // if loading, is set true, return loading
  if (loading) {
    return <h1>loading...</h1>;
  }
  // if user state is not available, then redirects to the /login route
  if (!loading && !user) {
    return <Navigate to="/login" />;
  } 

  return children;
};

export default Protected;
