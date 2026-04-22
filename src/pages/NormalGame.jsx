import React, { useContext, useEffect} from 'react';
import Board from '../components/Board';
import { SudokuContext } from '../context/SudokuContext';
import Timer from '../components/Timer';

export default function NormalGame() {
    const { startNormalGame, resetGame, board, isGameWon } = useContext(SudokuContext);

   // Generate puzzle only when mounting this page
   useEffect(() => {
       startNormalGame();
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

    return (
        <div className="game-page-container">
            <h2>Normal Game (9x9)</h2>
            <Timer />

            {/* Display congratulations message if won */}
            {isGameWon && (
                <div className="win-message">
                    🎉 Congratulations! You solved the puzzle! 🎉
                </div>
            )}

            {board.length > 0 && <Board />}

            {/* Attach onClick events and add CSS classes */}
            <div className="button-container">
                <button className="game-btn btn-new" onClick={() => startNormalGame(true)}>
                    New Game
                </button>
                <button className="game-btn btn-reset" onClick={resetGame}>
                    Reset
                </button>
            </div>
        </div>
    );
}
