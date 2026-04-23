import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './db/model/user.model.js';

const router = express.Router();

// register API (POST /api/user/register)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // 2. check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' }); // 409 Conflict
        }

        // 3. Hash the password (Bonus Point)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create a new user and save to the database
        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();

        // 5. Sign JWT token and set it in Cookie
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token expires in 1 day
        });

        // res.cookie('token', token, {
        //     httpOnly: true, // Prevent XSS attacks
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict'
        // });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({ message: 'User registered successfully', username: newUser.username });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // 2. check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' }); // 統一回傳 invalid credentials 避免被猜帳號
        }

        // 3. check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 4. Sign JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // 5. Set token in Cookie
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict'
        // });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,      
            sameSite: 'none',  
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({ message: 'Logged in successfully', username: user.username });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// logout API (POST /api/user/logout)
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;