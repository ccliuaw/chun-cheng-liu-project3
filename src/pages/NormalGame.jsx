import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import { SudokuContext } from '../context/SudokuContext';
import Timer from '../components/Timer';

export default function NormalGame() {
    const { id } = useParams(); // get the game ID from the URL
    const navigate = useNavigate();

    // loadGame From DB
    const { loadGameFromDB, board, isGameWon, resetGame } = useContext(SudokuContext);
    
    const [gameInfo, setGameInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // get the game data from backend API using the ID, then load it into Context for Board to render
        const fetchGame = async () => {
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

        fetchGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (errorMsg) return <div className="game-page-container"><h3>{errorMsg}</h3></div>;
    if (!gameInfo) return <div className="game-page-container"><h3>Loading Normal Game...</h3></div>;

    return (
        <div className="game-page-container">
            {/* show game name and creator */}
            <h2>{gameInfo.name} (9x9)</h2>
            <p style={{ marginBottom: '20px' }}>Created by: {gameInfo.creator}</p>

            <Timer />

            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}

            {board && board.length > 0 && <Board />}

            <div className="button-container">
                <button className="game-btn btn-new" onClick={() => navigate('/games')}>
                    Back to Games
                </button>
                <button className="game-btn btn-reset" onClick={resetGame}>
                    Reset
                </button>
            </div>
        </div>
    );
}