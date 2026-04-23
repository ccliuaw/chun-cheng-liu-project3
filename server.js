import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './backend/api/user.api.js';
import gameRoutes from './backend/api/game.api.js';
dotenv.config(); // load environment variables from .env file

const app = express();

// --- CORS settings ---
const allowedOrigins = [
    'http://localhost:5173', 
    'https://your-frontend.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true 
}));

app.use(express.json()); // parse JSON data from frontend
app.use(cookieParser()); // parse cookies from request

// --- MongoDB connection settings ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
      console.log('Successfully connected to MongoDB!');
  })
  .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
  });

app.use('/api/user', userRoutes); // use user routes
app.use('/api/sudoku', gameRoutes); // use game routes

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});