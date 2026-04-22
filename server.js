import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // load environment variables from .env file

const app = express();
app.use(express.json()); // parse JSON data from frontend

// --- MongoDB connection settings ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
      console.log('Successfully connected to MongoDB!');
  })
  .catch((err) => {
      console.error('MongoDB connection failed:', err.message);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});