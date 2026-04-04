import React, { useState } from 'react'
import FormGroup from '../components/FormGroup'
import "../style/register.scss";import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const Register = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

   const { loading, handleRegister } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    // calling function
    await handleRegister({ username, email, password });
    // navigating to '/' route after successfull function call
    navigate("/");
  }


  return (
    <main className="register-page">
      <div className="form-page">
        <h1>Register</h1>
        <form
        onSubmit={handleSubmit}
        >
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
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              label="Username"
              placeholder="Enter your username"
            />
            <FormGroup
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              label="Password"
              placeholder="Enter your password"
            />

            <button className="button">Register</button>
          </div>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>{" "}
        </p>
      </div>
    </main>
  );
}

export default Register