const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    wins: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = userSchema;