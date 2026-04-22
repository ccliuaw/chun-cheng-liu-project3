const mongoose = require('mongoose');
const gameSchema = require('../schema/game.schema');

module.exports = mongoose.model('Game', gameSchema);