import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Timer from '../components/Timer';
import { SudokuContext } from '../context/SudokuContext';

export default function NormalGame() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { loadGameFromDB, board, isGameWon, resetGame } = useContext(SudokuContext);

    const [gameInfo, setGameInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const { user } = useContext(SudokuContext); // Get current logged-in user

const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this game? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`https://chun-cheng-liu-project3.onrender.com/api/sudoku/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            alert("Game deleted successfully.");
            navigate('/games'); // Redirect back to selection page [cite: 143]
        } else {
            const data = await response.json();
            alert(data.error || "Failed to delete game.");
        }
    } catch (error) {
        alert("Server connection error.");
    }
};

    // --- stage1: Fetch game from database on page load ---
    useEffect(() => {
        const fetchNormalGame = async () => {
            try {
                const response = await fetch(`https://chun-cheng-liu-project3.onrender.com/api/sudoku/${id}`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setGameInfo(data);
                    loadGameFromDB(data);
                } else {
                    setErrorMsg(data.error);
                }
            } catch (error) {
                setErrorMsg('Cannot connect to the server');
            }
        };

        if (id) fetchNormalGame();
    }, [id, loadGameFromDB]);

    // --- stage2: Auto-save logic ---
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await fetch(`https://chun-cheng-liu-project3.onrender.com/api/sudoku/${id}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.ok) {
                    setGameInfo(data);
                    loadGameFromDB(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            fetchGame();
        }
    }, []);

    if (errorMsg) return <div className="game-page-container"><h3 style={{ color: 'red' }}>{errorMsg}</h3></div>;
    if (!gameInfo) return <div className="game-page-container"><h3>Loading Normal Game...</h3></div>;

    return (
        <div className="game-page-container">
            <h2 className="page-title">{gameInfo.name} (9x9)</h2>
            <p className="selection-subtitle">Created by: <strong>{gameInfo.creator}</strong></p>

            <Timer />

            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}

            {board.length > 0 && <Board />}

            <div className="button-container">
                <button className="game-btn btn-new" onClick={() => navigate('/games')}>
                    Back to List
                </button>
                <button className="game-btn btn-reset" onClick={resetGame}>
                    Reset
                </button>
                {/* Bonus Requirement: Show DELETE button only for the creator  */}
                {user && gameInfo && user.username === gameInfo.creator && (
                    <button className="game-btn btn-delete" onClick={handleDelete}>
                        DELETE
                    </button>
                )}
            </div>
        </div>
    );
}