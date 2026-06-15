import React, { useState } from "react";
import "../styles/register.scss";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handleRegister } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate('/');
  }

  return (
    <div>
      <div className="register-page">
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <FormGroup
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label="Username"
              placeholder="Enter your username"
            />
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
            <button className="button">Submit</button>
          </form>
          <p>
            Already have an account? <Link to="/login"> Login </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
