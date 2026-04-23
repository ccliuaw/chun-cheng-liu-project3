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

// Create new game API (POST /api/sudoku)
// Note: We place the verifyToken middleware in the middle to ensure that only logged-in users can create games
router.post('/sudoku', verifyToken, async (req, res) => {
    try {
        const { difficulty, board, initialBoard } = req.body;

        // 1. Generate a unique name for the game
        const uniqueName = await generateUniqueName();

        // 2. Create a new game record
        const newGame = new Game({
            name: uniqueName,
            difficulty: difficulty || 'EASY', // Default to EASY
            creator: req.user.username,       // Username extracted from token
            board: board || [],               // Expecting an array of 81 numbers from frontend
            initialBoard: initialBoard || [],
            isCompleted: false
        });

        await newGame.save();
        res.status(201).json({ message: 'Game created successfully', game: newGame });

    } catch (error) {
        console.error('Create Game Error:', error);
        res.status(500).json({ error: 'Internal server error' });
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

export default router;