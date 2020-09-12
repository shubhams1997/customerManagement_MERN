const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  getUserForUpdate,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// parameters
router.param("userId", getUserById);
router.param("updateUserId", getUserForUpdate);

// routers
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put(
  "/user/:userId/:updateUserId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateUser
);

module.exports = router;
