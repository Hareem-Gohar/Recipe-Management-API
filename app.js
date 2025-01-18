const express = require("express");
const cors = require("cors");
const authMiddleware = require("./Middleware/AuthMiddleware");
const adminMiddleware = require("./Middleware/AdminAuthMidlleware")
require('dotenv').config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recipes", require("./Routes/RecipeRoutes"));
app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api/comments", require("./Routes/CommentRoutes"));
app.use("/api/favorites", require("./Routes/FavoriteRoutes"));
app.use("/api/ratings", require("./Routes/RatingRoutes"));
app.use("/api/blogs", require("./Routes/BlogRoutes"));
app.use('/some-protected-route', authMiddleware, (req, res) => {
      //console.log('Protected route accessed by:', req.user); 
      res.status(200).send({ message: 'Protected route' });
  });
  
  app.use('/some-admin-route', authMiddleware, adminMiddleware, (req, res) => {
      //console.log('Admin route accessed by:', req.user); 
      res.status(200).send({ message: 'Admin route' });
  });
  


module.exports = app;
