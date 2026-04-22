import React, { useContext, useEffect } from 'react';
import Board from '../components/Board';
import Timer from '../components/Timer';
import { SudokuContext } from '../context/SudokuContext';

export default function EasyGame() {
    const { startEasyGame, resetGame, board, isGameWon } = useContext(SudokuContext);

    // Generate puzzle only when mounting this page
    useEffect(() => {
        startEasyGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="game-page-container">
            <h2>Easy Game (6x6)</h2>
            <Timer />

            {/* Display congratulations message if won */}
            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}
            {board.length > 0 && <Board />}

            <div className="button-container">
                <button className="game-btn btn-new" onClick={() => startEasyGame(true)}>New Game</button>
                <button className="game-btn btn-reset" onClick={resetGame}>Reset</button>
            </div>
        </div>
    );
}
