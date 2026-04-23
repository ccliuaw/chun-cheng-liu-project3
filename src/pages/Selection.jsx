import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Selection() {
    const puzzles = [
        { id: 1, name: "The Iron Logic", author: "Brain", difficulty: "Hard (9x9)", path: "/games/normal" },
        { id: 2, name: "Sudoku Inferno", author: "Jack", difficulty: "Hard (9x9)", path: "/games/normal" },
        { id: 3, name: "The Unsolvable", author: "LeBron", difficulty: "Hard (9x9)", path: "/games/normal" }
    ];

    const [isCreating, setIsCreating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // handle create game button click
    const handleCreateGame = async (difficulty) => {
        setIsCreating(true);
        setErrorMsg('');

        try {
            const response = await fetch('http://localhost:8000/api/sudoku', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // include credentials to send cookies (for authentication)
                credentials: 'include', 
                body: JSON.stringify({ difficulty }), 
            });

            const data = await response.json();

            if (response.ok) {
                // successfully created a new game, navigate to the game page (you can customize this to go to the specific game page if you have one)
                alert(`Game created successfully! Name: ${data.game.name}`);

                // In a real application, you would typically fetch the game list again or redirect to the specific game page
                // Here we simply reload the page so you can see the results in the terminal or database
                window.location.reload();
            } else {
                setErrorMsg(data.error || 'Failed to create game.');
            }
        } catch (error) {
            console.error('Create Game Error:', error);
            setErrorMsg('Cannot connect to the server.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="static-page-container selection-container">
            <h2 className="page-title">Game Selection</h2>
            <p className="selection-subtitle">
                Choose a specific challenge from our list below, or create your own!
            </p>

            {/* --- create new game section --- */}
            <div className="create-game-section" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>✨ Create a New Game</h3>
                <p>Generate a new puzzle with a unique 3-word name.</p>
                
                {errorMsg && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMsg}</p>}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                        className="game-btn btn-easy" 
                        onClick={() => handleCreateGame('EASY')}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : '+ Create Easy Game'}
                    </button>
                    
                    <button 
                        className="game-btn btn-normal" 
                        onClick={() => handleCreateGame('NORMAL')}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : '+ Create Normal Game'}
                    </button>
                </div>
            </div>
            {/* ----------------------------- */}

            <h3 style={{ marginTop: '20px' }}>Available Games</h3>
            <table className="selection-table">
                <thead>
                    <tr>
                        <th>Puzzle Name</th>
                        <th>Author</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {puzzles.map((puzzle) => (
                        <tr key={puzzle.id}>
                            <td>
                                <Link to={puzzle.path} className="selection-link">
                                    {puzzle.name}
                                </Link>
                            </td>
                            <td>{puzzle.author}</td>
                            <td>{puzzle.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}