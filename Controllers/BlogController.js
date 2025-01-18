const Blog = require("../Models/BlogModel");
const mongoose = require("mongoose");

const createBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      description: req.body.description,
      image: req.body.image,
      author: userId,
      tags: req.body.tags && Array.isArray(req.body.tags) ? req.body.tags : [],
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    //  console.error("Error creating blog:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create blog", error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(403).json({ message: "Not authorized to update this blog" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid blog post ID" });
    }

    const blogPost = await Blog.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // console.log('Blog Post:', blogPost);
    // console.log('User:', req.user);

    const isAuthor =
      req.user &&
      req.user.id &&
      req.user.id.toString() === blogPost.author.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        message: "Access denied. You are not authorized to delete this post.",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Blog post deleted successfully",
      postId: req.params.id,
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const deleteBlogAdmin = async (req, res) => {
  try {
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog post:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("author", "name");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlogAdmin,
  deleteBlog,
  getBlogs,
  getBlogById,
};
