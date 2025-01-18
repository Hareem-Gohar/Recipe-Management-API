const express = require('express');
const { addRating, getAverageRating } = require('../Controllers/RatingController');
const authMiddleware = require("../Middleware/AuthMiddleware")
const router = express.Router();

router.post('/:recipeId/rate', authMiddleware, addRating); 
router.get('/:recipeId/rating',   getAverageRating); 

module.exports = router;
