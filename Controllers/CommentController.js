const Comment = require("../Models/CommentModel");
const Recipe = require("../Models/recipes");
const Blog = require("../Models/BlogModel");


exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { recipeId, blogId } = req.params;

  try {
    let commentType = "";
    let commentId = "";

    if (recipeId) {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      commentType = "Recipe";
      commentId = recipeId;
    } else if (blogId) {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      commentType = "Blog";
      commentId = blogId;
    }
    if (!recipeId && !blogId) {
      return res.status(400).json({ message: "Target ID (recipe or blog) is required" });
    }

    const newComment = new Comment({
      user: req.user.id,
      commentType,
      commentId,
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  const { recipeId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ recipe: commentId })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email");

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this recipe" });
    }
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
