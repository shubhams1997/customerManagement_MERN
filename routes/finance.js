const express = require("express");
const router = express.Router();

// imports
const {
  createFinance,
  getFinanceById,
  getFinance,
  getAllFinance,
} = require("../controllers/finance");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("financeId", getFinanceById);

// routes

// post
router.post(
  "/finance/create/:userId",
  isSignedIn,
  isAuthenticated,
  createFinance
);

// get
router.get("/finance/:financeId", isSignedIn, getFinance);
router.get("/finances", isSignedIn, getAllFinance);

module.exports = router;
