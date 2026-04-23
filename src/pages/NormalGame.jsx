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

    // --- stage1: Fetch game from database on page load ---
    useEffect(() => {
        const fetchNormalGame = async () => {
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
                setErrorMsg('Cannot connect to the server');
            }
        };

        if (id) fetchNormalGame();
    }, [id, loadGameFromDB]);

    // --- stage2: Auto-save logic ---
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

    if (errorMsg) return <div className="game-page-container"><h3 style={{color: 'red'}}>{errorMsg}</h3></div>;
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
            </div>
        </div>
    );
}