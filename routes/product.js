const express = require("express");
const { check } = require("express-validator");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();

const {
  getProductById,
  getProduct,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

// get routes
router.get("/product/:productId", isSignedIn, getProduct);
router.get("/products", isSignedIn, getAllProducts);

// post routes
router.post(
  "/product/create/:userId",
  [
    check("name", "Name Must be 3 char long").isLength({ min: 3 }),
    check("salesPrice", "Sales Price Must be a Number").isInt(),
    check("dealerPrice", "Dealer Price Must be a Number").isInt(),
    check("incentive", "Incentive Must be a Number").isInt(),
    check("landingPrice", "Landing Price Must be a Number").isInt(),
  ],
  isSignedIn,
  isAuthenticated,
  createProduct
);

// put
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  updateProduct
);

// delete
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteProduct
);

module.exports = router;
