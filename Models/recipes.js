const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    recipe_name: {
      type: String,
      required: [true, "Recipe name is required"],
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      match: /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp)$/i,
    },
    prep_time: {
      type: Number,
      required: [true, "Preparation time is required"],
      min: 0,
    },
    cook_time: {
      type: Number,
      min: 0,
    },
    recipe_making_time: {
      type: Number,
      required: [true, "Recipe making time is required"],
      min: 0,
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    recipe_instructions: {
      steps: {
        type: [String],
        required: [true, "Recipe instructions are required"],
        validate: (v) => Array.isArray(v) && v.length > 0,
      },
    },
    nutrition: {
      calories: {
        type: Number,
        required: [true, "Calories are required"],
        min: 0,
      },
      fat: { type: String, required: [true, "Fat content is required"] },
      carbs: { type: String, required: [true, "Carbs content is required"] },
      protein: {
        type: Number,
        required: [true, "Protein content is required"],
        min: 0,
      },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
