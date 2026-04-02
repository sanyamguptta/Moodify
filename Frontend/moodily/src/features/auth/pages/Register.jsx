import React from 'react'
import FormGroup from '../components/FormGroup'
import "../style/register.scss";import { Link } from 'react-router';
;

const Register = () => {
  return (
    <main className='register-page'>
        <div className="form-page">
            <h1>Register</h1>
            <form>
                <div className="form-container">
                    <FormGroup label='Email' placeholder='Enter your email' />
                    <FormGroup label='Username' placeholder='Enter your username' />
                    <FormGroup label='Password' placeholder='Enter your password' />

                    <button className='button'>Register</button>
                </div>
            </form>
            <p>Already have an account? <Link to='/login'>Login</Link> </p>
        </div>
    </main>
  )
}

export default Register