const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../Controllers/UserController');
const authMiddleware = require('../Middleware/AuthMiddleware');
const adminMiddleware = require("../Middleware/AdminAuthMidlleware")

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, getAllUsers);

router.post('/signup', registerUser);

router.post('/login', loginUser);

module.exports = router;
