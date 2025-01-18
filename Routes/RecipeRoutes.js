const express = require("express");
const {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../Controllers/RecipeControlers");
const router = express.Router();
const  authMiddleware  = require("../Middleware/AuthMiddleware");
const adminMiddleware = require("../Middleware/AdminAuthMidlleware")


router.get("/", getAllRecipes);

router.post("/", authMiddleware, createRecipe);

router.get("/:id", getRecipeById);

router.put("/:id", authMiddleware, updateRecipe);

router.delete("/:id", authMiddleware, deleteRecipe);

module.exports = router;
