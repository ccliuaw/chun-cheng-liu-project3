import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SudokuContext } from '../context/SudokuContext';

export default function Navbar() {
    const { user, logout } = useContext(SudokuContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('https://chun-cheng-liu-project3.onrender.com//api/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }
        
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/" end>Sudoku Master</NavLink>
            </div>
            
            <ul className="navbar-links">
                <li><NavLink to="/" end>Home</NavLink></li>
                <li><NavLink to="/games">Play Game</NavLink></li>
                <li><NavLink to="/rules">Rules</NavLink></li>
                <li><NavLink to="/scores">High Scores</NavLink></li>

                {user ? (
                    <>
                        <li className="user-profile">
                            <span className="username-text">
                                Hello, <strong>{user.username}</strong>
                            </span>
                        </li>
                        <li>
                            <button className="logout-btn" onClick={handleLogout}>
                                Log Out
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/login" className="auth-link">Log In</NavLink></li>
                        <li><NavLink to="/register" className="auth-link auth-register">Sign Up</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
}