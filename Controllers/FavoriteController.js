const Favorite = require("../Models/FavoritesModel");
const Recipe = require("../Models/recipes");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.addFavorite = async (req, res) => {
  const { recipeId } = req.params;
  const { id } = req.user;
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingFavorite = await Favorite.findOne({
      user: id,
      recipe: recipeId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Recipe already in favorites" });
    }

    const newFavorite = new Favorite({
      user: id,
      recipe: recipeId,
    });

    await newFavorite.save();
    res.status(201).json({ message: "Recipe added to favorites" });
  } catch (err) {
   // console.error("Error in adding favorite:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.user;
    const { recipeId } = req.params;
    // console.log(`User ID: ${id}, Recipe ID: ${recipeId} (in request)`);

    const favorite = await Favorite.findOne({ user: id, recipe: recipeId });
    // console.log(`Found favorite: ${JSON.stringify(favorite)}`);

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    const deletedFavorite = await Favorite.findOneAndDelete({
      user: id,
      recipe: recipeId,
    });
    // console.log(`Deleted favorite: ${JSON.stringify(deletedFavorite)}`);

    return res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    //console.error("Error in removeFavorite:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const favorites = await Favorite.find({ user: req.user.id }).populate(
      "recipe"
    );

    res.status(200).json(favorites);
  } catch (err) {
    // console.error("Error retrieving favorites:", err);
    res
      .status(500)
      .json({ message: "Failed to retrieve favorites", error: err.message });
  }
};
