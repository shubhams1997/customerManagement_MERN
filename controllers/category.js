const Category = require("../models/category");
const { validationResult } = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not Found!",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save Category in DB",
      });
    }
    return res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No Category Found!",
      });
    }
    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving in DB",
      });
    }
    return res.json(category);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete category",
      });
    }
    return res.json({
      message: `${category.name} deleted successfully!`,
    });
  });
};
