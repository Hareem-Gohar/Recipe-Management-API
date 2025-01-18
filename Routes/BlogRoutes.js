const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  deleteBlogAdmin,
} = require("../Controllers/BlogController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const adminMiddleware = require("../Middleware/AdminAuthMidlleware");
const router = express.Router();

router.route("/").get(getBlogs).post(authMiddleware, createBlog);

router
  .route("/:id")
  .get(getBlogById)
  .put(authMiddleware, updateBlog)
  .delete(authMiddleware, deleteBlog);

router.delete('/:id/admin', [authMiddleware, adminMiddleware], deleteBlogAdmin);

module.exports = router;
