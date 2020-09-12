const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "No user found!",
      });
    }
    console.log("user profile added");
    req.profile = user;
    next();
  });
};

exports.getUserForUpdate = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Invalid Request for user update",
      });
    }
    req.updateProfile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.updateProfile._id },
    { $set: req.body },
    { new: true, userFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to update user in DB",
        });
      }
      req.profile.salt = undefined;
      req.profile.encry_password = undefined;
      return res.json(user);
    }
  );
};
