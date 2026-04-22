import React, { useState, useEffect, useContext } from 'react';
import { SudokuContext } from '../context/SudokuContext';

export default function Timer() {
    // Bring in the states we need from Context
    const { isGameWon, gameId, board } = useContext(SudokuContext);
    const [seconds, setSeconds] = useState(0);

    // Determine the mode based on board length
    const mode = board.length === 81 ? 'normal' : 'easy';

    // 1. Reset or Resume timer based on the gameId from Context
    useEffect(() => {
        if (gameId === 'loaded_normal') {
            const savedTime = localStorage.getItem('sudoku_time_normal');
            setSeconds(savedTime ? parseInt(savedTime, 10) : 0);
        } else if (gameId === 'loaded_easy') {
            const savedTime = localStorage.getItem('sudoku_time_easy');
            setSeconds(savedTime ? parseInt(savedTime, 10) : 0);
        } else {
            // If it's a timestamp (meaning New Game or Reset was clicked), start from 0
            setSeconds(0);
        }
    }, [gameId]);

    // 2. Ticking Logic & Auto-Save
    useEffect(() => {
        let interval = null;

        if (!isGameWon && board.length > 0) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    const newTime = prev + 1;
                    // Save the new time to localStorage every second
                    localStorage.setItem(`sudoku_time_${mode}`, newTime.toString());
                    return newTime;
                });
            }, 1000);
        } else if (isGameWon && interval) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isGameWon, board.length, mode]);

    // Helper function to format seconds into MM:SS
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const remainingSeconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${remainingSeconds}`;
    };

    return (
        <p className="timer-text">
            Time: <span className="timer-numbers">{formatTime(seconds)}</span>
        </p>
    );
}
