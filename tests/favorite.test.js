const request = require("supertest");
const app = require("../app");
const User = require("../Models/user");
const Recipe = require("../Models/recipes");
const Favorite = require("../Models/FavoritesModel");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
let mongoServer;
let user, recipe, token, recipeId;

const generateValidToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

beforeAll(async () => {
  user = await User.create({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  });

  recipe = await Recipe.create({
    recipe_name: "Test Recipe",
    category: "Main Course",
    user: user.id,
    nutrition: {
      calories: 500,
      protein: 10,
      carbs: "20g",
      fat: "5g",
    },
    recipe_making_time: 30,
    cook_time: 15,
    prep_time: 10,
    image: "https://example.com/valid-image-url.jpg",
    ingredients: ["ingredient 1", "ingredient 2"],
    recipe_instructions: {
      steps: ["Step 1", "Step 2"],
    },
  });

  recipeId = recipe.id;
  token = generateValidToken(user);
});
beforeEach(async () => {
  const favorite = await new Favorite({
    user: user.id,
    recipe: recipeId,
  }).save();

  // console.log("Created favorite:", favorite);
});

afterAll(async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

afterEach(async () => {
  await Favorite.deleteMany({ user: user.id, recipe: recipeId });
});

describe("Favorites API", () => {
  describe("POST /api/favorites/:recipeId", () => {
    it("should add a recipe to favorites", async () => {
      //console.log("recipeId:", recipeId);
      //console.log("Token:", token);

      await Favorite.deleteOne({ user: user._id, recipe: recipeId });

      const res = await request(app)
        .post(`/api/favorites/${recipeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      //console.log("Response body:", res.body);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Recipe added to favorites");

      const favorite = await Favorite.findOne({
        user: user._id,
        recipe: recipeId,
      });

      console.log("Favorite entry:", favorite);

      expect(favorite).toBeTruthy();
    });

    it("should return an error if the recipe is already in favorites", async () => {
      await new Favorite({
        user: user.id,
        recipe: recipeId,
        image: "testimage.jpg",
      }).save();

      const res = await request(app)
        .post(`/api/favorites/${recipeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Recipe already in favorites");
    });

    it("should return an error if recipe not found", async () => {
      const invalidRecipeId = "609b65f23e72c8a3284d50ef";

      const res = await request(app)
        .post(`/api/favorites/${invalidRecipeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Recipe not found");
    });
  });

  describe("DELETE /api/favorites/:recipeId", () => {
    it("should remove a recipe from favorites", async () => {
      // console.log("Testing with user ID:", user.id);
      // console.log("Testing with recipeId:", recipeId);

      const res = await request(app)
        .delete(`/api/favorites/${recipeId}`)
        .set("Authorization", `Bearer ${token}`);

      //   console.log("Response:", res.body);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Recipe removed from favorites");

      const favoriteAfterDelete = await Favorite.findOne({
        user: user.id,
        recipe: recipeId,
      });

      //console.log("Favorite after deletion:", favoriteAfterDelete);
      expect(favoriteAfterDelete).toBeNull();
    });

    it("should return an error if favorite not found", async () => {
      const invalidRecipeId = "609b65f23e72c8a3284d50ef";

      const res = await request(app)
        .delete(`/api/favorites/${invalidRecipeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Favorite not found");
    });
  });

  describe("GET /api/favorites", () => {
    it("should retrieve all favorite recipes for the user", async () => {
      const favorite = new Favorite({
        user: user.id,
        recipe: recipeId,
        image: "testimage.jpg",
      });
      await favorite.save();

      const res = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].recipe._id).toBe(String(recipeId));
    });

    it("should return an empty array if no favorites found", async () => {
      const existingFavorites = await Favorite.find({ user: user.id });
      if (existingFavorites.length > 0) {
        await Favorite.deleteMany({ user: user.id });
      }

      const res = await request(app)
        .get("/api/favorites")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});
