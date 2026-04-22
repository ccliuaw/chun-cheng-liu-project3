const BLANK = 0;

// 1. Check if placing a number violates Sudoku rules
function isValid(board, row, col, num) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
    }

    // Check 3x3 sub-grid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

// 2. Fill the entire board completely using backtracking
function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === BLANK) {
                // Shuffle numbers 1-9 to ensure a random board every time
                const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                numbers.sort(() => Math.random() - 0.5);

                for (let num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;

                        // Recursively try to fill the rest of the board
                        if (fillBoard(board)) {
                            return true;
                        }

                        // If it leads to a dead end, backtrack
                        board[row][col] = BLANK;
                    }
                }
                // No valid number found, trigger backtracking
                return false;
            }
        }
    }
    return true; // Board is completely filled
}

// 3. Count how many valid solutions exist for the current board
function countSolutions(board, countObj) {
    let row = -1;
    let col = -1;
    let isEmpty = false;

    // Find the first empty cell
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === BLANK) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty) break;
    }

    // If no empty cells, we found a valid solution
    if (!isEmpty) {
        countObj.value++;
        return;
    }

    // Try all numbers
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            countSolutions(board, countObj);
            board[row][col] = BLANK; // Backtrack
        }
    }
}

// 4. Main function to generate a valid game board
export function generateNormalBoard() {
    // Create a 9x9 2D array filled with 0
    let board = Array.from({ length: 9 }, () => Array(9).fill(BLANK));

    // Fill the board completely
    fillBoard(board);

    // Remove numbers to create the puzzle (Target: leave 30 clues)
    // 81 total cells - 30 clues = 51 cells to remove
    let cellsToRemove = 51; 
    let attempts = 20; // Failsafe to prevent infinite loops

    while (cellsToRemove > 0 && attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        // Find a cell that is not already blank
        while (board[row][col] === BLANK) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }

        // Temporarily remove the number
        const backup = board[row][col];
        board[row][col] = BLANK;

        // Check if the board still has exactly ONE unique solution
        let countObj = { value: 0 };
        countSolutions(board, countObj);

        if (countObj.value !== 1) {
            // Removing this number created multiple solutions, put it back
            board[row][col] = backup;
            attempts--;
        } else {
            // Safe to remove
            cellsToRemove--;
        }
    }

    // Convert the 2D array (9x9) back to a 1D array (81) for our React Context
    return board.flat();
}

// --- 6x6 Easy Mode Generator ---

function isValid6x6(board, row, col, num) {
    for (let i = 0; i < 6; i++) {
        if (board[row][i] === num) return false;
        if (board[i][col] === num) return false;
    }

    // 6x6 Sudoku uses 2x3 sub-grids
    const startRow = Math.floor(row / 2) * 2;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num) return false;
        }
    }
    return true;
}

function fillBoard6x6(board) {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] === BLANK) {
                const numbers = [1, 2, 3, 4, 5, 6];
                numbers.sort(() => Math.random() - 0.5);

                for (let num of numbers) {
                    if (isValid6x6(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard6x6(board)) return true;
                        board[row][col] = BLANK;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

export function generateEasyBoard() {
    let board = Array.from({ length: 6 }, () => Array(6).fill(BLANK));
    fillBoard6x6(board);

    // 6x6 has 36 cells. Half the board is 18 clues, so we remove 18 cells.
    let cellsToRemove = 18;
    
    // For simplicity in Easy Mode, we just randomly remove 18 cells 
    // (6x6 is small enough that random removal usually leaves a solvable board)
    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 6);
        let col = Math.floor(Math.random() * 6);

        if (board[row][col] !== BLANK) {
            board[row][col] = BLANK;
            cellsToRemove--;
        }
    }

    return board.flat();
}
