import React, { useContext } from 'react';
import { SudokuContext } from '../context/SudokuContext';

export default function Cell({ value, isFixed, index, boardSize }) {
    // Bring in conflicts from Context
    const { selectedCell, setSelectedCell, updateCell, conflicts, isGameWon } = useContext(SudokuContext);

    const isSelected = selectedCell === index;
    
    // Check if this specific cell index is in the conflicts array
    const isIncorrect = conflicts.includes(index);

    // Calculate row and column (0-indexed)
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    const handleClick = () => {
        if (isGameWon) return; // Don't allow selecting if game is won
        setSelectedCell(index);
    };

    const handleChange = (e) => {
        if (isFixed || isGameWon) return; // Don't allow changes if fixed or game is won

        const inputValue = e.target.value;
        
        if (inputValue === '') {
            updateCell(index, 0);
            return;
        }

        const lastChar = inputValue.slice(-1);
        
        // Dynamic regex validation based on board size
        const isValidInput = boardSize === 6 ? /^[1-6]$/.test(lastChar) : /^[1-9]$/.test(lastChar);
        
        if (isValidInput) {
            updateCell(index, parseInt(lastChar, 10));
        }
    };

    // Add the "incorrect" class if there's a rule violation
    let cellClassName = "cell";
    if (isFixed) cellClassName += " fixed";
    if (isSelected && !isGameWon) cellClassName += " selected";
    if (isIncorrect) cellClassName += " incorrect";

    // Dynamic thick borders
    if (boardSize === 6) {
        if (col === 2) cellClassName += " border-right-thick";
        if (row === 1 || row === 3) cellClassName += " border-bottom-thick";
    } else {
        if (col === 2 || col === 5) cellClassName += " border-right-thick";
        if (row === 2 || row === 5) cellClassName += " border-bottom-thick";
    }

    return (
        <input 
            type="text"
            className={cellClassName} 
            value={value === 0 ? '' : value} 
            readOnly={isFixed || isGameWon} // Lock input if it's a fixed cell OR if the game is won    
            onClick={handleClick}
            onChange={handleChange}
        />
    );
}