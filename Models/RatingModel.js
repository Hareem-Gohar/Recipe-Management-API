const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  created_at: { type: Date, default: Date.now },
});
ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
