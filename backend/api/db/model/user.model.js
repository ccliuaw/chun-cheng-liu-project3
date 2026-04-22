import mongoose from 'mongoose';
import userSchema from '../schema/user.schema.js';

export default mongoose.model('User', userSchema);