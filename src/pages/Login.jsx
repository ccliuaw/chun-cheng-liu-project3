import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setErrorMsg('');

        try {
            // send login request to backend
            const response = await fetch('http://localhost:8000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include credentials to send cookies (for authentication)
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // successful login, redirect to games page
                navigate('/games');
            } else {
                // login failed (incorrect password or user not found)
                setErrorMsg(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMsg('Cannot connect to the server.');
        }
    };

    // disable login button if username or password is empty
    const isFormIncomplete = !username || !password;

    return (
        <div className="static-page-container auth-page-container">
            <h2 className="page-title">Welcome Back</h2>

            <form className="auth-card" onSubmit={handleLogin}>

                {/* error message display */}
                {errorMsg && (
                    <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMsg}
                    </div>
                )}

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter your username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="game-btn btn-new auth-btn"
                    disabled={isFormIncomplete}
                    style={{ 
                        opacity: isFormIncomplete ? 0.5 : 1, 
                        cursor: isFormIncomplete ? 'not-allowed' : 'pointer' 
                    }}
                >
                    Log In
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register" className="auth-link">Sign up here</Link>
                </p>
            </form>
        </div>
    );
}