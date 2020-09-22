const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// routers
// post
router.post(
  "/category/create/:userId",
  [check("name", "Name must be 3 char long").isLength({ min: 3 })],
  isSignedIn,
  isAuthenticated,
  createCategory
);

// get
router.get("/category/:categoryId", isSignedIn, getCategory);
router.get("/categories", isSignedIn, getAllCategories);

// put
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  updateCategory
);

// delete
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteCategory
);

module.exports = router;
