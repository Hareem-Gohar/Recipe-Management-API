const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Recipe = require("../Models/recipes");
const User = require("../Models/user");
require("dotenv").config();

let token;
let invalidToken = "Bearer invalidtoken123";
let recipeId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  const userRes = await request(app).post("/api/users/signup").send({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  });

  const loginRes = await request(app).post("/api/users/login").send({
    email: "testuser@example.com",
    password: "password123",
  });
  token = loginRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await Recipe.deleteMany();
    await User.deleteMany();
    const remainingRecipes = await Recipe.countDocuments();
    const remainingUsers = await User.countDocuments();
    expect(remainingRecipes).toBe(0);
    expect(remainingUsers).toBe(0);
  }

  await mongoose.connection.close();
});

describe("Recipe API", () => {
  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .send({
        recipe_name: "Unauthorized Biryani",
        image: "https://example.com/image.jpg",
        prep_time: 30,
        cook_time: 60,
        ingredients: ["Rice", "Chicken", "Spices"],
        recipe_instructions: { steps: ["Step 1", "Step 2"] },
        nutrition: { calories: 600, fat: "20g", carbs: "70g", protein: 30 },
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication failed");
  });

  it("should create a new recipe", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        recipe_name: "Chicken Biryani",
        category: "Mian  Courrse",
        image: "https://example.com/image.jpg",
        prep_time: 30,
        cook_time: 60,
        recipe_making_time: 90,
        ingredients: ["Rice", "Chicken", "Spices"],
        recipe_instructions: { steps: ["Step 1", "Step 2"] },
        nutrition: { calories: 600, fat: "20g", carbs: "70g", protein: 30 },
        privacy: "public",
      });

    recipeId = res.body._id;
    expect(res.status).toBe(201);
    expect(res.body.recipe_name).toBe("Chicken Biryani");
    //  console.log("Created Recipe ID:", recipeId); // Log the created recipe ID
  });

  it("should return 400 for invalid recipe data (missing fields)", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        image: "https://example.com/image.jpg",
        cook_time: 50,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Recipe name is required");
  });

  it("should return 404 for non-existent recipe", async () => {
    const res = await request(app)
      .get("/api/recipes/65ff5a4e9a69e0abcde4567a")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Recipe not found");
  });

  it("should update a recipe", async () => {
    if (!recipeId) {
      // console.error("No valid recipe ID found to update");
      return;
    }

    const res = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ recipe_name: "Updated Biryani" });

    // console.log("Full response for update:", res); // Log the full response
    // console.log("Response body for update:", res.body); // Log the response body
    //  console.log("Recipe ID for update:", recipeId); // Log the recipe ID

    expect(res.status).toBe(200);
    expect(res.body.recipe_name).toBe("Updated Biryani");
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .post("/api/recipes")
      .send({
        recipe_name: "Unauthorized Biryani",
        image: "https://example.com/image.jpg",
        prep_time: 30,
        cook_time: 60,
        ingredients: ["Rice", "Chicken", "Spices"],
        recipe_instructions: { steps: ["Step 1", "Step 2"] },
        nutrition: { calories: 600, fat: "20g", carbs: "70g", protein: 30 },
      });

    console.log("Response Body:", res.body); // Log the response body

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication failed");
  });

  it("should delete a recipe", async () => {
    if (!recipeId) {
      console.error("No valid recipe ID found to delete");
      return;
    }

    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    // console.log("Full response for delete:", res); // Log the full response
    // console.log("Response body for delete:", res.body); // Log the response body
    // console.log("Recipe ID for delete:", recipeId); // Log the recipe ID

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Recipe deleted");
  });

  it("should return 404 for deleting non-existent recipe", async () => {
    const res = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Recipe not found");
  });
});
