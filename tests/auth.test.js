const request = require("supertest");
const app = require("../app"); 
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
};

describe("Authentication and Authorization Middleware Tests", () => {
  let validUserToken, adminToken;

  const user = { _id: "userId123", role: "user" };
  const admin = { _id: "adminId123", role: "admin" };

  beforeEach(() => {
    validUserToken = generateToken(user);
    adminToken = generateToken(admin);
  });

  describe("Protected Route Access", () => {
    it("should allow access to protected route for valid users", async () => {
      const res = await request(app)
        .get("/some-protected-route")
        .set("Authorization", `Bearer ${validUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Protected route" });
    });

    it("should deny access to protected route without token", async () => {
      const res = await request(app).get("/some-protected-route");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Authentication failed");
    });
  });

  describe("Admin Route Access", () => {
    it("should deny access to admin route for non-admin users", async () => {
      const res = await request(app)
        .get("/some-admin-route")
        .set("Authorization", `Bearer ${validUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe(
        "Access denied. You are not authorized to delete this post."
      );
    });

    it("should allow access to admin route for admin users", async () => {
      const res = await request(app)
        .get("/some-admin-route")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Admin route" });
    });
  });
});
