const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
   // console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed' }); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        //console.log('Authenticated user:', req.user);
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};


module.exports = authMiddleware;
