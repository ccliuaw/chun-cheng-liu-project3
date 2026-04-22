import React, { useContext } from 'react';
import Cell from './Cell';
import { SudokuContext } from '../context/SudokuContext';

export default function Board() {
    // Pull BOTH the current board and the initial board from Context
    const { board, initialBoard } = useContext(SudokuContext);
    
    if (board.length === 0) return null; // Wait for board to generate

    const size = Math.sqrt(board.length); // 6 or 9
    const boardClass = size === 6 ? "sudoku-board-6x6" : "sudoku-board-9x9";

    return (
        <div className={boardClass}>
            {board.map((num, index) => {
                // BUG FIX: Check the initialBoard, NOT the current num!
                const isFixed = initialBoard[index] > 0;
                
                return (
                    <Cell 
                        key={index} 
                        index={index} 
                        value={num === 0 ? '' : num} 
                        isFixed={isFixed} 
                        boardSize={size}
                    />
                );
            })}
        </div>
    );
}