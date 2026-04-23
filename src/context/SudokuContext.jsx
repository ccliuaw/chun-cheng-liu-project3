import React, { createContext, useState, useMemo, useEffect } from 'react';
import { generateNormalBoard, generateEasyBoard } from '../utils/sudokuGenerator';

export const SudokuContext = createContext();

// Helper function to find all cells that violate Sudoku rules
function getConflictingCells(board) {
    const conflicts = new Set();
    const size = Math.sqrt(board.length); // Will be 9 or 6

    const boxRows = size === 6 ? 2 : 3;
    const boxCols = size === 6 ? 3 : 3;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) continue; // Skip empty cells

        const row = Math.floor(i / size);
        const col = i % size;
        const num = board[i];

        // Check the entire row
        for (let c = 0; c < size; c++) {
            if (c !== col && board[row * size + c] === num) {
                conflicts.add(i);
                conflicts.add(row * size + c);
            }
        }

        // Check the entire column
        for (let r = 0; r < size; r++) {
            if (r !== row && board[r * size + col] === num) {
                conflicts.add(i);
                conflicts.add(r * size + col);
            }
        }

        // Check the 3x3 or 2x3 sub-grid
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

    return Array.from(conflicts); // Convert Set back to an array
}

export function SudokuProvider({ children }) {
    const [board, setBoard] = useState([]);
    const [initialBoard, setInitialBoard] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [gameId, setGameId] = useState(Date.now());

    // --- 🌟 全端版專用：載入來自 DB 的遊戲 ---
    const loadGameFromDB = (dbGameData) => {
        // 1. 設定目前棋盤 (如果是新開的局，後端會給滿是 0 的陣列)
        setBoard(dbGameData.board);
        
        // 2. 設定初始棋盤 (方便 Reset 功能回到最初的題目狀態)
        setInitialBoard(dbGameData.initialBoard);
        
        // 3. 設定 GameId 來觸發 Timer 重置
        // 如果是全新的遊戲，可以用 Date.now()；如果想要延續時間，可以自訂
        setGameId(dbGameData._id); 
        
        // 4. 清除選中的格子
        setSelectedCell(null);
    };

    // --- LocalStorage 建議改為「純存檔」而非「自動載入」 ---
    // (在全端版中，這部分可以保留作為離線備援，但主導權在 fetch)
    useEffect(() => {
        if (board.length === 81) {
            localStorage.setItem('sudoku_save_normal', JSON.stringify({ board, initialBoard }));
        } else if (board.length === 36) {
            localStorage.setItem('sudoku_save_easy', JSON.stringify({ board, initialBoard }));
        }
    }, [board, initialBoard]);

    // 修改：將 startNormalGame 改為只負責「強制產生新題目」時使用 (或暫時用不到)
    const startNormalGame = (isNew = true) => {
        const newPuzzle = generateNormalBoard();
        setBoard(newPuzzle);
        setInitialBoard(newPuzzle);
        setSelectedCell(null);
        setGameId(Date.now());
    };

    // 修改：將 startEasyGame 同步
    const startEasyGame = (isNew = true) => {
        const newPuzzle = generateEasyBoard();
        setBoard(newPuzzle);
        setInitialBoard(newPuzzle);
        setSelectedCell(null);
        setGameId(Date.now());
    };

    // Reset the board to its initial state
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

    // Calculate conflicts dynamically every time the board changes
    const conflicts = useMemo(() => getConflictingCells(board), [board]);

    // Check if the game is won
    const isGameWon = useMemo(() => {
        // 1. If the board hasn't loaded yet, return false
        if (board.length === 0) return false;

        // 2. Are there any empty cells (0) left?
        const isFull = !board.includes(0);

        // 3. Are there zero rule violations?
        const isCorrect = conflicts.length === 0;

        // The game is won if the board is full AND completely correct
        return isFull && isCorrect;
    }, [board, conflicts]);

    const value = {
        board,
        setBoard,
        initialBoard,
        selectedCell,
        setSelectedCell,
        updateCell,
        startNormalGame,
        startEasyGame,
        loadGameFromDB,
        resetGame,
        conflicts,
        isGameWon,
        gameId
    };

    return (
        <SudokuContext.Provider value={value}>
            {children}
        </SudokuContext.Provider>
    );
}