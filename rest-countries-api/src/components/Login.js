import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Login page component.
 * Handles user authentication and redirects to home on success.
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Please enter your credentials</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">
                        Sign In
                    </button>

                    <div className="login-footer">
                        <p>Don't have an account? <a href="/register" className="login-link">Sign up</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;