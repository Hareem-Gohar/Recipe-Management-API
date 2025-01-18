const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentType: {
    type: String,
    enum: ['Recipe', 'Blog'],
    required: true
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'commentType', 
  },
  text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
