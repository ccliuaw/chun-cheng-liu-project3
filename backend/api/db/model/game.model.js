import mongoose from 'mongoose';
import gameSchema from '../schema/game.schema.js'; // 必須加 .js

export default mongoose.model('Game', gameSchema);