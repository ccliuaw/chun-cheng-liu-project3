import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateNormalBoard, generateEasyBoard } from '../utils/sudokuGenerator';

export default function Selection() {
    const [games, setGames] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchGames = async () => {
        try {
            const response = await fetch('https://chun-cheng-liu-project3.onrender.com/api/sudoku', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (response.ok) {
                setGames(data);
            } else {
                console.error('Failed to fetch games:', data.error);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const handleCreateGame = async (difficulty) => {
        setIsCreating(true);
        setErrorMsg('');

        const newPuzzle = difficulty === 'EASY' ? generateEasyBoard() : generateNormalBoard();

        try {
            const response = await fetch('https://chun-cheng-liu-project3.onrender.com/api/sudoku', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ 
                    difficulty, 
                    board: newPuzzle, 
                    initialBoard: newPuzzle 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Game created successfully! Name: ${data.game.name}`);
                fetchGames(); 
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

    // Helper function to format date as "Jan 1, 2020"
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="static-page-container selection-container">
            <h2 className="page-title">Game Selection</h2>
            <p className="selection-subtitle">
                Choose a specific challenge from our list below, or create your own!
            </p>

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
                        {isCreating ? 'Creating...' : '+ Create Easy Game (6x6)'}
                    </button>
                    
                    <button 
                        className="game-btn btn-normal" 
                        onClick={() => handleCreateGame('NORMAL')}
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating...' : '+ Create Normal Game (9x9)'}
                    </button>
                </div>
            </div>

            <h3 style={{ marginTop: '20px' }}>Available Games</h3>
            <table className="selection-table">
                <thead>
                    <tr>
                        <th>Puzzle Name</th>
                        <th>Author</th>
                        <th>Difficulty</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game._id}>
                            <td>
                                <Link to={`/games/${game.difficulty.toLowerCase()}/${game._id}`} className="selection-link">
                                    {game.name}
                                </Link>
                            </td>
                            <td>{game.creator}</td>
                            <td>{game.difficulty}</td>
                            {/* Formatting the timestamp to required format */}
                            <td>{formatDate(game.createdAt)}</td>
                        </tr>
                    ))}
                    
                    {games.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '15px' }}>
                                No games available right now. Be the first to create one!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}