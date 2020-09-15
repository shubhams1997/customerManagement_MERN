const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("brandId", getBrandById);

// routes
// get
router.get("/brands", isSignedIn, getAllBrands);

// post
router.post(
  "/brand/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createBrand
);

// put
router.put(
  "/brand/:brandId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateBrand
);

// delete
router.delete(
  "/brand/:brandId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteBrand
);

module.exports = router;
