import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Timer from '../components/Timer';
import { SudokuContext } from '../context/SudokuContext';

export default function EasyGame() {
    const { id } = useParams(); // get the game ID from the URL, e.g. /games/easy/12345 -> id = 12345
    const navigate = useNavigate();
    
    // loadGame From DB
    const { loadGameFromDB, resetGame, board, isGameWon } = useContext(SudokuContext);

    const [gameInfo, setGameInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // get the game data from backend API using the ID, then load it into Context for Board to render
        const fetchEasyGame = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/sudoku/${id}`, {
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
                setErrorMsg('Cannot connect to server.');
            }
        };

        if (id) {
            fetchEasyGame();
        }
    }, [id, loadGameFromDB]);

    if (errorMsg) return <div className="game-page-container"><h3 style={{color: 'red'}}>{errorMsg}</h3></div>;
    if (!gameInfo) return <div className="game-page-container"><h3>Loading Easy Game...</h3></div>;

    return (
        <div className="game-page-container">
            <h2>{gameInfo.name} (6x6)</h2>
            <p style={{ marginBottom: '20px' }}>Created by: {gameInfo.creator}</p>
            
            <Timer />

            {/* Display congratulations message if won */}
            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}

            {board.length > 0 && <Board />}

            <div className="button-container">
                <button className="game-btn btn-new" onClick={() => navigate('/games')}>
                    Back to Selection
                </button>
                <button className="game-btn btn-reset" onClick={resetGame}>
                    Reset
                </button>
            </div>
        </div>
    );
}