const express = require('express');
const { addComment, getComments } = require('../Controllers/CommentController');
const router = express.Router();

router.post('/:recipeId/comments', addComment); 
router.get('/:recipeId/comments', getComments); 

module.exports = router;
