import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SudokuContext } from '../context/SudokuContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();
    const { login } = useContext(SudokuContext);

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:8000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // FIX: Guarantee a valid user object is passed to Context.
                // If the backend doesn't explicitly return a 'user' object, 
                // we construct it using the username from the local state.
                const userPayload = data.user ? data.user : { username: username };
                
                // Update global state
                login(userPayload); 
                
                // Redirect to selection page
                navigate('/games');
            } else {
                setErrorMsg(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMsg('Cannot connect to the server.');
        }
    };

    // Requirement: Submit button disabled if any input is blank
    const isFormIncomplete = !username.trim() || !password.trim();

    return (
        <div className="static-page-container auth-page-container">
            <h2 className="page-title">Sudoku Master Login</h2>

            <form className="auth-card" onSubmit={handleLogin}>

                {errorMsg && (
                    <div style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                        {errorMsg}
                    </div>
                )}

                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        placeholder="Password" 
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
                    New user? <Link to="/register" className="auth-link">Create an account</Link>
                </p>
            </form>
        </div>
    );
}