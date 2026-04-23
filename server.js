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
app.use(cors({
    origin: 'http://localhost:5173', // This is the default port for Vite
    credentials: true // Allow frontend and backend to pass cookies
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
app.use('/api', gameRoutes); // use game routes

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});