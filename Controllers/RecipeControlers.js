const Recipe = require("../Models/recipes");
const User = require("../Models/user");
const mongoose = require("mongoose");

exports.getAllRecipes = async (req, res) => {
  const { keyword, category, privacy, page = 1, limit = 10 } = req.query;

  try {
    const query = { privacy: privacy || "public" };

    if (keyword) {
      query.recipe_name = { $regex: keyword, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const totalRecipes = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query).skip(skip).limit(limit);

    res.json({
      recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecipes / limit),
        totalRecipes,
      },
    });
  } catch (err) {
    console.error("Error in getAllRecipes:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Error in getRecipeById:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.createRecipe = async (req, res) => {
  const {
    recipe_name,
    category,
    privacy,
    image,
    prep_time,
    cook_time,
    recipe_making_time,
    ingredients,
    recipe_instructions,
    nutrition,
  } = req.body;

  try {
    if (!recipe_name) {
      return res.status(400).json({ message: "Recipe name is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (!prep_time) {
      return res.status(400).json({ message: "Preparation time is required" });
    }
    if (!recipe_making_time) {
      return res
        .status(400)
        .json({ message: "Recipe making time is required" });
    }
    if (!ingredients) {
      return res.status(400).json({ message: "Ingredients are required" });
    }
    if (!recipe_instructions) {
      return res
        .status(400)
        .json({ message: "Recipe instructions are required" });
    }
    if (!nutrition) {
      return res
        .status(400)
        .json({ message: "Nutrition details are required" });
    }

    const newRecipe = new Recipe({
      _id: new mongoose.Types.ObjectId(),
      recipe_name,
      category,
      privacy,
      image,
      prep_time,
      cook_time,
      recipe_making_time,
      ingredients,
      recipe_instructions,
      nutrition,
      user: req.user.id,
    });

    const newRecipeCreated = await newRecipe.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { recipes: newRecipeCreated._id },
    });

    res.status(201).json(newRecipeCreated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map((err) => err.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    console.error("Error in createRecipe:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (!recipe.user.equals(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this recipe" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error in updateRecipe:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error("Error in deleteRecipe:", err);
    res.status(500).json({ message: err.message });
  }
};
