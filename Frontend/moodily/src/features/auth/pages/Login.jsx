import React, {  useState } from "react";
import "../style/login.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import Register from "./Register";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();

  // storing useNavigate() in variable
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    // calling function
    await handleLogin({ email, password })
    // navigating to '/' route after successfull function call
    navigate('/');
  }

  return (
    <main className="login-page">
      <div className="form-page">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <FormGroup
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              label="Email"
              placeholder="Enter your email"
            />
            <FormGroup
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="Password"
              placeholder="Enter your password"
            />
            <button className="button" type="submit">
              Login
            </button>
          </div>
          <p>
            Don't have an account? <Link to="/register">Register </Link>{" "}
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
