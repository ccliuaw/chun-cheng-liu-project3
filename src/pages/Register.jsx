import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const handleRegister = (e) => {
        e.preventDefault(); 
        alert("Registration functionality will be connected to the backend later!");
    };

    return (
        <div className="static-page-container auth-page-container">
            <h2 className="page-title">Create Account</h2>

            <form className="auth-card" onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Choose a username" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Create a password" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Verify Password</label>
                    <input 
                        type="password" 
                        placeholder="Repeat password" 
                        required 
                    />
                </div>
                
                <button type="submit" className="game-btn btn-new auth-btn">
                    Sign Up
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Login here</Link>
                </p>
            </form>
        </div>
    );
}
