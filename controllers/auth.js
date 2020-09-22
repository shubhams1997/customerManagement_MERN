const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");
const { validationResult, check } = require("express-validator");
const User = require("../models/user");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
        console.log(err);
      return res.status(400).json({
        error: "Error in saving data in Database",
      });
    }
    return res.json({
      name: user.name,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { name, password } = req.body;

  User.findOne({ name }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Check your Username",
      });
    }
    if (!user) {
      return res.status(400).json({
        error: "User not Found with this Username.",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Please check your Username or Password",
      });
    }

    // create a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    // set token in cookie
    res.cookie("token", token, { expire: new Date() + 999 });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "User sign out successfully!",
  });
};

exports.isSignedIn = expressJWT({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Not an Admin Account! Access Denied!",
    });
  }
  next();
};
