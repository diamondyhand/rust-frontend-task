import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
export default function SignUp() {
    const { isLoggedIn, register } = useContext(AuthContext);
    const navigate = useNavigate();
    if (isLoggedIn) {
        navigate("/create-pool");
    }

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSumbit = (event) => {
        event.preventDefault();
        register(email, password, username);
        // console.log();
        setEmail('');
        setPassword('');
    }
    const handleChange = (event) => {
        if (event.target.name === 'email') {
            setEmail(() => event.target.value)
        } else if (event.target.name === 'password') {
            setPassword(() => event.target.value);
        } else {
            setUsername(() => event.target.value);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSumbit}>
                    <h3>Sign Up</h3>
                    <div className="mb-3">
                        <label>User Name</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Enter name"
                            value={username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        already have an account?  <a href="/login">sign in</a>
                    </p>
                </form>
            </div>
        </div>
    )
}