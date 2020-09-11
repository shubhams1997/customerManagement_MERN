const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "No user found!",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(res.profile);
};

exports.updateUser = (req, res) => {
  return res.send("update route");
};
