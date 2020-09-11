const express = require("express");
const router = express.Router();

const { getUserById, getUser, updateUser } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// parameters
router.param("userId", getUserById);

// routers
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, isAdmin, updateUser);

module.exports = router;
