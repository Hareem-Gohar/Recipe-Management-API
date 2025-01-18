const express = require('express');
const { addFavorite, removeFavorite, getUserFavorites } = require('../Controllers/FavoriteController');
const  authMiddleware  = require('../Middleware/AuthMiddleware');
const router = express.Router();

router.post('/:recipeId', authMiddleware, addFavorite);

router.delete('/:recipeId', authMiddleware, removeFavorite);

router.get('/', authMiddleware, getUserFavorites);

module.exports = router;
