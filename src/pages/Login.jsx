import React from 'react';

export default function Login() {
    const handleLogin = (e) => {
        e.preventDefault(); // Prevents the page from refreshing when you click submit
        alert("Login functionality will be connected to the backend later!");
    };

    return (
        <div className="static-page-container auth-page-container">
            <h2 className="page-title">Player Login</h2>

            <form className="auth-card" onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter username" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        required 
                    />
                </div>
                
                <button type="submit" className="game-btn btn-new auth-btn">
                    Log In
                </button>
            </form>
        </div>
    );
}
