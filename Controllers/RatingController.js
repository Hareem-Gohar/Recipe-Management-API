const Rating = require("../Models/RatingModel");
const Recipe = require("../Models/recipes");

exports.addRating = async (req, res) => {
  const { rating } = req.body;
  const { recipeId } = req.params;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const newRating = new Rating({
      user: req.user.id,
      recipe: recipeId,
      rating,
    });

    await newRating.save();

    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ message: "Error adding rating: " + err.message });
  }
};

exports.getAverageRating = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const ratings = await Rating.find({ recipe: recipeId });
    if (ratings.length === 0) {
      return res
        .status(404)
        .json({
          message: "Recipe not found and No ratings found for this recipe",
        });
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    res.json({ averageRating: parseFloat(averageRating) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error calculating average rating: " + err.message });
  }
};
