```markdown
# Backend Application

## Introduction

This project is a **Recipe Management API** built with **Node.js** and **Express**, and powered by **MongoDB**. The API allows users to manage recipes, leave comments, rate dishes, add favorites, read blogs, and more. It is designed to handle both regular users and administrators, with secure authentication and authorization systems in place.

This backend is built with flexibility and scalability in mind, supporting easy integration with a frontend application. It also includes testing capabilities using **MongoMemoryServer**, allowing for isolated MongoDB simulations during development.

Whether you're looking to build a recipe platform, extend the features, or create a community around food blogging, this API offers a strong foundation for your project.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
  - [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
  - [Public Endpoints](#public-endpoints)
  - [Protected Endpoints](#protected-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Middleware](#middleware)
- [Testing with MongoMemoryServer](#testing-with-mongodb-memory-server)
- [License](#license)
- [Author](#author)
- [Contributions](#contributions)
- [Contact](#contact)

## Features

- **Recipe Management**: Add, update, delete, and fetch recipes.
- **User Management**: Handle user registration, authentication, and roles (user/admin).
- **Comments System**: Enable users to comment on recipes.
- **Favorites**: Allow users to mark recipes as favorites.
- **Ratings**: Enable users to rate recipes.
- **Blogs**: Manage blog posts related to recipes.
- **Secure Routes**:
  - Protected routes for authenticated users.
  - Admin-specific routes for managing sensitive resources.

## Tech Stack

- **Backend Framework**: Node.js with Express
- **Database**: MongoDB (with `mongoose` for schema modeling)
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Variables**: `dotenv`
- **Testing**: Jest and Supertest
- **In-Memory Database for Testing**: MongoMemoryServer

## Project Structure
```

backend/
├── src/
│ ├── Controllers/ # Functions for handling routes
│ │ └── BlogController.js
│ │ └── CommentController.js
│ │ └── RatingController.js
│ │ └── FavoriteController.js
│ │ └── RecipeController.js
│ │ └── UserController.js
│ ├── Models/ # Mongoose models
│ │ └── BlogModel.js
│ │ └── CommentModel.js
│ │ └── RatingModel.js
│ │ └── FavoriteModel.js
│ │ └── recipes.js
│ │ └── user.js
│ ├── Routes/ # Routes
│ │ └── BlogRoutes.js
│ │ └── CommentRoutes.js
│ │ └── FavoriteRoutes.js
│ │ └── RatingRoutes.js
│ │ └── RecipeRoutes.js
│ │ └── UserRoutes.js
│ ├── Config/ # Configuration files
│ │ └── db.js
│ ├── app.js # Express app setup
│ └── index.js # Entry point
├── Middleware/ # Authentication middleware
│ ├── AuthMiddleware.js
│ ├── AdminAuthMiddleware.js
├── tests/ # Testing
│ ├── auth.test.js
│ ├── blog.test.js
│ ├── favorite.test.js
│ ├── rating.test.js
│ ├── recipe.test.js
├── .env # Environment variables
├── package.json # Project dependencies
├── jest.setup.js # Jest configuration
└── README.md # Documentation

````

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud instance)
- `npm` (or `yarn`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hareem-Gohar/Recipe-Management-API.git
   cd Recipe-Management-API
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server in development mode:

   ```bash
   npm start
   ```

### Running the Server

For production:

```bash
npm run start:prod
```

### Running Tests

- Run unit tests using Jest:

  ```bash
  npm test
  ```

## API Endpoints

### Public Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/api/recipes`        | Fetch all recipes   |
| POST   | `/api/users/register` | Register a new user |

### Protected Endpoints

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| POST   | `/api/favorites`          | Add a recipe to favorites   |
| GET    | `/api/comments/:recipeId` | Fetch comments for a recipe |

### Admin Endpoints

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| DELETE | `/api/recipes/:id` | Delete a recipe        |
| POST   | `/api/blogs`       | Create a new blog post |

## Middleware

- **`AuthMiddleware`**: Protects routes by verifying the JWT token.
- **`AdminAuthMiddleware`**: Ensures only admin users access certain routes.

## Testing with MongoMemoryServer

This project uses **MongoMemoryServer** to spin up an in-memory MongoDB instance for testing purposes. MongoMemoryServer allows you to test the functionality of your routes without requiring a real MongoDB instance.

### Running Tests

1. Install Jest and Supertest:

   ```bash
   npm install --save-dev jest supertest
   ```

2. Run tests:

   ```bash
   npm test
   ```

## Contributions

Contributions are welcome! Feel free to open issues or submit pull requests to enhance this project.

## Contact

For any queries or support, contact me at [malikzarsh2@gmail.com].

```

```
