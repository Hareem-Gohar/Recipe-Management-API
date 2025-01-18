const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const Recipe = require("../Models/recipes");
const Rating = require("../Models/RatingModel");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Rating API tests', () => {
  let user;
  let recipe;
  let ratingData;
  let recipeId;
  let mongoServer;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Create user
    user = await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    // Generate JWT token
    const payload = { id: user._id, email: user.email };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create recipe
    recipe = await Recipe.create({
      recipe_name: 'Test Recipe',
      category: "Main Course",
      user: user._id,
      nutrition: {
        protein: 10,
        carbs: 20,
        fat: 5,
        calories: 200,
      },
      recipe_making_time: 30,
      cook_time: 15,
      prep_time: 10,
      image: 'https://example.com/valid-image-url.jpg',
      ingredients: ['ingredient 1', 'ingredient 2'],
      recipe_instructions: {
        steps: ['Step 1', 'Step 2'],
      },
    });

    recipeId = recipe.id;

    // Set up rating data
    ratingData = {
      user: user._id,
      recipe: recipeId,
      rating: 5,
    };
  });

  afterAll(async () => {
    await Rating.deleteMany({ recipe: recipeId });
    await Recipe.deleteOne({ _id: recipeId });
    await User.deleteOne({ email: 'testuser@example.com' });

    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test('should allow a user to add a rating to a recipe', async () => {
    await Rating.deleteOne({ user: user._id, recipe: recipeId });
  
    const response = await request(app)
      .post(`/api/ratings/${recipeId}/rate`)
      .set('Authorization', `Bearer ${token}`)
      .send(ratingData)
      .expect(201);
  
    expect(response.body).toHaveProperty('rating');
    expect(response.body.rating).toBe(5);
  });
  
  test('should return 401 if the user is not authenticated', async () => {
    const response = await request(app)
      .post(`/api/ratings/${recipeId}/rate`)
      .send(ratingData)
      .expect(401);
  
    expect(response.body.message).toBe('Authentication failed');
  });
  
  test('should return the average rating for a recipe', async () => {
    await Rating.deleteMany({ recipe: recipeId });
    await Rating.create({ user: user._id, recipe: recipeId, rating: 5 });
  
    const response = await request(app)
      .get(`/api/ratings/${recipeId}/rating`)
      .expect(200);
  
    expect(response.body).toHaveProperty('averageRating');
    expect(response.body.averageRating).toBeCloseTo(5.0, 1);
  });
  
  test('should return 404 if the recipe does not exist', async () => {
    const nonExistentRecipeId = new mongoose.Types.ObjectId();
  
    const response = await request(app)
      .get(`/api/ratings/${nonExistentRecipeId}/rating`)
      .expect(404);
  
    expect(response.body.message).toBe('Recipe not found and No ratings found for this recipe');
  });
  
});
