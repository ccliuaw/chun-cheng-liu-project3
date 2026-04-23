import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // get token from cookies
    const token = req.cookies.token; 
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Please log in.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        next(); // good to go, call the next middleware or API handler
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
};