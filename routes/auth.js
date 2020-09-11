const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signin, signup, signout } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "Name must be at least 3 char").isLength({ min: 3 }),
    check("password", "Password must be 3 char long").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("name", "Name must be at least 3 char").isLength({ min: 3 }),
    check("password", "Password must be 3 char long").isLength({ min: 3 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
