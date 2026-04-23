import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import { generateNormalBoard, generateEasyBoard } from '../utils/sudokuGenerator';

export const SudokuContext = createContext();

// Helper function to find all cells that violate Sudoku rules
function getConflictingCells(board) {
    const conflicts = new Set();
    const size = Math.sqrt(board.length);

    const boxRows = size === 6 ? 2 : 3;
    const boxCols = size === 6 ? 3 : 3;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) continue;

        const row = Math.floor(i / size);
        const col = i % size;
        const num = board[i];

        for (let c = 0; c < size; c++) {
            if (c !== col && board[row * size + c] === num) {
                conflicts.add(i);
                conflicts.add(row * size + c);
            }
        }

        for (let r = 0; r < size; r++) {
            if (r !== row && board[r * size + col] === num) {
                conflicts.add(i);
                conflicts.add(r * size + col);
            }
        }

        const startRow = Math.floor(row / boxRows) * boxRows;
        const startCol = Math.floor(col / boxCols) * boxCols;
        for (let r = 0; r < boxRows; r++) {
            for (let c = 0; c < boxCols; c++) {
                const checkRow = startRow + r;
                const checkCol = startCol + c;
                const checkIndex = checkRow * size + checkCol;

                if (checkIndex !== i && board[checkIndex] === num) {
                    conflicts.add(i);
                    conflicts.add(checkIndex);
                }
            }
        }
    }
    return Array.from(conflicts);
}

export function SudokuProvider({ children }) {
    // --- Game State ---
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [gameId, setGameId] = useState(Date.now());

    // --- User State (Project 3 Requirement) ---
    const [user, setUser] = useState(null);

    // Initialize user from localStorage on mount 
    useEffect(() => {
        const savedUser = localStorage.getItem('sudoku_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('sudoku_user');
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('sudoku_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sudoku_user');
        // Add logic here to clear cookies via backend API if necessary [cite: 93, 95]
    };

    // --- Database Integration ---
    // Use useCallback to prevent unnecessary re-renders in useEffects 
    const loadGameFromDB = useCallback((dbGameData) => {
        setBoard(dbGameData.board);
        setInitialBoard(dbGameData.initialBoard);
        setGameId(dbGameData._id);
        setSelectedCell(null);
    }, []);

    const resetGame = () => {
        setBoard([...initialBoard]);
        setSelectedCell(null);
        setGameId(Date.now());
    };

    const updateCell = (index, value) => {
        const newBoard = [...board];
        newBoard[index] = value;
        setBoard(newBoard);
    };

    const conflicts = useMemo(() => getConflictingCells(board), [board]);

    const isGameWon = useMemo(() => {
        if (board.length === 0) return false;
        const isFull = !board.includes(0);
        const isCorrect = conflicts.length === 0;
        return isFull && isCorrect;
    }, [board, conflicts]);

    const value = {
        board,
        setBoard,
        initialBoard,
        selectedCell,
        setSelectedCell,
        updateCell,
        loadGameFromDB,
        resetGame,
        conflicts,
        isGameWon,
        gameId,
        user,    // Added for Navbar [cite: 56]
        login,   // Added for Login Page [cite: 44]
        logout   // Added for Navbar [cite: 56]
    };

    return (
        <SudokuContext.Provider value={value}>
            {children}
        </SudokuContext.Provider>
    );
}