const jwt = require("jsonwebtoken");
require("dotenv").config();
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return res
      .status(403)
      .json({
        message: "Access denied. You are not authorized to delete this post.",
      });
  }
  next(); 
};

module.exports = adminMiddleware;
