import express from 'express';
import Game from './db/model/Game.model.js';
import { verifyToken } from './middleware/auth.js';

const router = express.Router();

// 20 words for test
const wordList = [
    'Apple', 'Banana', 'Cat', 'Dog', 'Elephant', 'Frog', 'Ghost', 'House', 'Ice', 'Juice',
    'Kite', 'Lion', 'Moon', 'Night', 'Ocean', 'Piano', 'Queen', 'Rose', 'Sun', 'Tree'
];

// helper function to generate a unique game name by combining 3 random words
const generateUniqueName = async () => {
    let isUnique = false;
    let name = '';

    // Keep looping until we generate a name that doesn't exist in the database
    while (!isUnique) {
        const w1 = wordList[Math.floor(Math.random() * wordList.length)];
        const w2 = wordList[Math.floor(Math.random() * wordList.length)];
        const w3 = wordList[Math.floor(Math.random() * wordList.length)];
        name = `${w1} ${w2} ${w3}`;

        // Check if the generated name already exists in the database
        const existingGame = await Game.findOne({ name });
        if (!existingGame) {
            isUnique = true; // Name is unique, exit the loop
        }
    }
    return name;
};

// Create new game API (POST /api/sudoku) with support for pre-generated boards
router.post('/sudoku', verifyToken, async (req, res) => {
    try {
        const { difficulty, board, initialBoard } = req.body;
        const uniqueName = await generateUniqueName();

        const boardSize = difficulty === 'EASY' ? 36 : 81;

        const newGame = new Game({
            name: uniqueName,
            difficulty: difficulty || 'NORMAL',
            creator: req.user.username,
            // if the frontend provides a pre-generated board, use it; otherwise, initialize with an empty board
            board: board || Array(boardSize).fill(0),
            initialBoard: initialBoard || Array(boardSize).fill(0),
            isCompleted: false
        });

        await newGame.save();
        res.status(201).json({ message: 'Game created successfully', game: newGame });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create game' });
    }
});

// Create a new API to get all game records (GET /api/sudoku)
router.get('/sudoku', verifyToken, async (req, res) => {
    try {
        // Find all games and sort by creation time (newest first)
        const games = await Game.find().sort({ createdAt: -1 });
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Create a new API to get a single game by ID (GET /api/sudoku/:id)
router.get('/sudoku/:id', verifyToken, async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json(game);
    } catch (error) {
        console.error('Fetch Single Game Error:', error);
        // we return a 400 Bad Request for invalid ID and 500 for other errors
        res.status(400).json({ error: 'Invalid game ID format' });
    }
});

export default router;