import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="home-hero-container">
            <img 
                src="/assets/NYT_Sudoku_Logo.png" 
                alt="Sudoku Hero" 
                className="hero-image" 
            />

            <h1 className="hero-title">Welcome to Sudoku Master</h1>

            <p className="hero-description">
                Experience the ultimate logic puzzle game. Test your mind with our
                various difficulties and challenge yourself to beat the high scores.
            </p>

            {/* If you have a selection page, keep this route. Otherwise, change to /normal */}
            <Link to="/games" className="hero-link">
                <button className="game-btn btn-new hero-btn">Start Playing</button>
            </Link>
        </div>
    );
}
