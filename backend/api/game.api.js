import express from 'express';
import Game from './db/model/game.model.js'; 
import { verifyToken } from './middleware/auth.js';

const router = express.Router();

// 20 words for test
const wordList = [
    'Apple', 'Banana', 'Cat', 'Dog', 'Elephant', 'Frog', 'Ghost', 'House', 'Ice', 'Juice',
    'Kite', 'Lion', 'Moon', 'Night', 'Ocean', 'Piano', 'Queen', 'Rose', 'Sun', 'Tree'
];

// Helper function: Generate a unique game name by combining 3 random words and checking against the database
const generateUniqueName = async () => {
    let isUnique = false;
    let name = '';

    while (!isUnique) {
        const w1 = wordList[Math.floor(Math.random() * wordList.length)];
        const w2 = wordList[Math.floor(Math.random() * wordList.length)];
        const w3 = wordList[Math.floor(Math.random() * wordList.length)];
        name = `${w1} ${w2} ${w3}`;

        const existingGame = await Game.findOne({ name });
        if (!existingGame) {
            isUnique = true; 
        }
    }
    return name;
};

// --- create new game ---
router.post('/', verifyToken, async (req, res) => {
    try {
        const { difficulty, board, initialBoard } = req.body;
        const uniqueName = await generateUniqueName();
        const boardSize = difficulty === 'EASY' ? 36 : 81;

        const newGame = new Game({
            name: uniqueName,
            difficulty: difficulty || 'NORMAL',
            creator: req.user.username,
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

// --- get all games ---
router.get('/', verifyToken, async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// --- get single game content (GET /api/sudoku/:id) ---
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        console.error("Fetch Single Game Error:", error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

// --- 4. reset game (PUT /api/sudoku/:id) ---
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { board, isCompleted } = req.body;
        const gameId = req.params.id;

        const updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { board, isCompleted },
            { new: true } 
        );

        if (!updatedGame) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.status(200).json({ message: 'Game updated successfully', game: updatedGame });
    } catch (error) {
        console.error("Update Game Error:", error);
        res.status(500).json({ error: 'Failed to update game' });
    }
});

// --- High Score API (GET /api/highscore) ---
// Returns a list of users and their total wins, sorted by wins descending [cite: 110, 111]
router.get('/highscore/list', verifyToken, async (req, res) => {
    try {
        // Use MongoDB aggregation to count completed games per user
        const highscores = await Game.aggregate([
            { $match: { isCompleted: true } }, // Only count won games
            {
                $group: {
                    _id: "$creator", // Group by the username of the player
                    wins: { $sum: 1 } // Count the number of games
                }
            },
            { $sort: { wins: -1, _id: 1 } }, // Sort by wins (desc) and then username (asc) 
            { $project: { username: "$_id", wins: 1, _id: 0 } }
        ]);

        // Filter out users with 0 wins is handled by $match 
        res.status(200).json(highscores);
    } catch (error) {
        console.error("Highscore Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch high scores' });
    }
});

export default router;