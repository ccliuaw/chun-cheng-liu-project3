import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Timer from '../components/Timer';
import { SudokuContext } from '../context/SudokuContext';

export default function EasyGame() {
    const { id } = useParams(); // 🌟 1. 從網址抓取 Easy 遊戲的 ID
    const navigate = useNavigate();
    
    // 🌟 2. 引入 loadGameFromDB 來處理資料庫資料
    const { loadGameFromDB, resetGame, board, isGameWon } = useContext(SudokuContext);

    const [gameInfo, setGameInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // 🌟 3. 去後端抓這局特定的 6x6 遊戲
        const fetchEasyGame = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/sudoku/${id}`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    setGameInfo(data);
                    loadGameFromDB(data); // 餵給 Context，讓 Board 渲染出 36 格
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
            {/* 顯示資料庫存的隨機名稱 */}
            <h2>{gameInfo.name} (6x6)</h2>
            <p style={{ marginBottom: '20px' }}>Created by: {gameInfo.creator}</p>
            
            <Timer />

            {/* Display congratulations message if won */}
            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}
            
            {/* 這裡的 Board 會根據 Context 裡的 36 格資料自動渲染 */}
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