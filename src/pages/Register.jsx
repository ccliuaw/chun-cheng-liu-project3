import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); 
        setErrorMsg(''); 

        if (password !== verifyPassword) {
            setErrorMsg('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('https://chun-cheng-liu-project3.onrender.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include credentials to send cookies (for authentication)
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/games');
            } else {
                setErrorMsg(data.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            setErrorMsg('Cannot connect to the server.');
        }
    };

    const isFormIncomplete = !username || !password || !verifyPassword;

    return (
        <div className="static-page-container auth-page-container">
            <h2 className="page-title">Create Account</h2>

            <form className="auth-card" onSubmit={handleRegister}>
                
                {errorMsg && (
                    <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMsg}
                    </div>
                )}

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Choose a username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Create a password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Verify Password</label>
                    <input 
                        type="password" 
                        placeholder="Repeat password" 
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
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
                    Sign Up
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                </p>
            </form>
        </div>
    );
}