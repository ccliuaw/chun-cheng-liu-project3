const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    difficulty: { 
        type: String, 
        enum: ['EASY', 'NORMAL'], 
        required: true 
    },
    creator: { 
        type: String, 
        required: true 
    },
    board: { 
        type: [Number], 
        required: true 
    },
    initialBoard: { 
        type: [Number], 
        required: true 
    },
    isCompleted: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

module.exports = gameSchema;