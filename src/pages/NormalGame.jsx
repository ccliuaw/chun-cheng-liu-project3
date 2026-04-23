import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import { SudokuContext } from '../context/SudokuContext';
import Timer from '../components/Timer';

export default function NormalGame() {
    const { id } = useParams(); // 🌟 1. 從網址抓取這局遊戲的 ID
    const navigate = useNavigate();
    
    // 🌟 2. 從 Context 拿出載入資料庫遊戲的函式
    const { loadGameFromDB, board, isGameWon, resetGame } = useContext(SudokuContext);
    
    const [gameInfo, setGameInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // 🌟 3. 進入頁面時，去後端把這局遊戲的資料抓回來
        const fetchGame = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/sudoku/${id}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                
                if (response.ok) {
                    setGameInfo(data);
                    loadGameFromDB(data); // 把抓回來的陣列餵給你的 Context 和 Board
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
            {/* 顯示從資料庫來的名稱與作者 */}
            <h2>{gameInfo.name} (9x9)</h2>
            <p style={{ marginBottom: '20px' }}>Created by: {gameInfo.creator}</p>

            <Timer />

            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}

            {/* 你的 Board 元件一樣完美運作 */}
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