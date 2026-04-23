import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import Timer from '../components/Timer';
import { SudokuContext } from '../context/SudokuContext';

export default function EasyGame() {
    const { id } = useParams();
    const navigate = useNavigate();

    // extract necessary functions and state from SudokuContext
    const { loadGameFromDB, board, isGameWon, resetGame } = useContext(SudokuContext);
    
    const [gameInfo, setGameInfo] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // --- Stage 1: Fetch game from database on page load ---
    useEffect(() => {
    const fetchGame = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/sudoku/${id}`, {
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
    // 🌟 重點：把 [id, loadGameFromDB] 刪掉，改成空陣列 []
    // 這樣它就只會在「進入頁面」的那一刻執行一次，
    // 之後不論 board 怎麼變，都不會再去資料庫抓資料來覆蓋你的棋盤。
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

    // --- Stage 2: Auto-save logic (sync to DB when board changes) ---
    useEffect(() => {
        if (board && board.length > 0 && gameInfo) {
            const saveProgress = async () => {
                try {
                    await fetch(`http://localhost:8000/api/sudoku/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            board: board,
                            isCompleted: isGameWon
                        })
                    });
                    console.log('Progress auto-saved');
                } catch (err) {
                    console.error('Auto-save failed:', err);
                }
            };

            const delayDebounce = setTimeout(saveProgress, 1000);
            return () => clearTimeout(delayDebounce);
        }
    }, [board, isGameWon, id, gameInfo]);

    if (errorMsg) return <div className="game-page-container"><h3 style={{color: 'red'}}>{errorMsg}</h3></div>;
    if (!gameInfo) return <div className="game-page-container"><h3>Loading Easy Game...</h3></div>;

    return (
        <div className="game-page-container">
            <h2 className="page-title">{gameInfo.name} (6x6)</h2>
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
            </div>
        </div>
    );
}