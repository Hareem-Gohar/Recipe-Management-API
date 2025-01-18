const mongoose = require("mongoose");
const dotenv = require("dotenv");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const Blog = require("../Models/BlogModel");
const validUserId = new mongoose.Types.ObjectId();
const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config();

let mongoServer;
let blogId;
let validUserToken;
let adminToken;
let nonAdminToken;

const generateValidToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const user = { id: validUserId, role: "user" };
const admin = { id: new mongoose.Types.ObjectId(), role: "admin" };
const nonAdmin = { id: new mongoose.Types.ObjectId(), role: "user" };

beforeEach(async () => {
  validUserToken = generateValidToken(user);
  adminToken = generateValidToken(admin);
  nonAdminToken = generateValidToken(nonAdmin);

  const blog = new Blog({
    title: "Test Blog",
    content: "This is a test blog.",
    description: "A detailed description of the test blog.",
    image: "http://example.com/image.jpg",
    author: validUserId,
    category: "Technology",
  });
  const savedBlog = await blog.save();
  blogId = savedBlog._id;
});
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Dropping database...");
    await mongoose.connection.dropDatabase();
    console.log("Database dropped.");
  }

  console.log("Disconnecting mongoose...");
  await mongoose.disconnect();
  console.log("Mongoose disconnected.");

  if (mongoServer) {
    console.log("Stopping MongoDB server...");
    await mongoServer.stop();
    console.log("MongoDB server stopped.");
  }
});

jest.setTimeout(30000);

describe("Blog API Tests with User Authentication and Admin Deletion", () => {
  test("should create a new blog post for authenticated users", async () => {
    console.log("Valid User Token:", validUserToken);  // Log token for debugging
  
    const response = await supertest(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${validUserToken}`)
      .send({
        title: "New Blog Post",
        content: "This is the content of the new blog post.",
        description: "A description for the new blog post.",
        image: "http://example.com/new-image.jpg",
        category: "Technology",
        author: validUserId,
      });
  
    console.log("Response Status:", response.status);  // Log response status
    console.log("Response Body:", response.body);      // Log response body
  
    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Blog Post");
    expect(response.body.content).toBe(
      "This is the content of the new blog post."
    );
  });
  

  it("should return all blog posts for authenticated users", async () => {
    const response = await supertest(app)
      .get("/api/blogs")
      .set("Authorization", `Bearer ${validUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should return a blog post by ID", async () => {
    const response = await supertest(app)
      .get(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${validUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Test Blog");
  });

  it("should update a blog post by ID for authenticated user", async () => {
    const response = await supertest(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${validUserToken}`)
      .send({
        title: "Updated Blog Post Title",
        content: "Updated content for the blog post.",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Blog Post Title");
    expect(response.body.content).toBe("Updated content for the blog post.");
  });

  test("should delete a blog post by ID for authenticated user (self)", async () => {
    const response = await supertest(app)
      .delete("/api/blogs/" + blogId)
      .set("Authorization", `Bearer ${validUserToken}`);

    const decodedToken = jwt.verify(validUserToken, process.env.JWT_SECRET);
    //  console.log("Decoded user ID:", decodedToken._id);

    //  console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog post deleted successfully");
  });

  test("should return 403 if a regular user tries to delete a blog post", async () => {
    const response = await supertest(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${nonAdminToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Access denied. You are not authorized to delete this post."
    );
  });

  it("should delete a blog post by ID for admin", async () => {
    const response = await supertest(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog post deleted successfully");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(app).post("/api/blogs").send({
      title: "Unauthorized Post",
      content: "This should fail.",
      author: "user",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication failed");
  });
});
