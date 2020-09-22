const Product = require("../models/product");
const { validationResult } = require("express-validator");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not Found!",
      });
    }
    req.product = product;
    next();
  });
};

exports.getProduct = (req, res) => {
  return res.json(req.product);
};

exports.getAllProducts = (req, res) => {
  Product.find().exec((err, products) => {
    if (err || !products) {
      return res.status(400).json({
        error: "Product not Found!",
      });
    }
    return res.json(products);
  });
};

exports.createProduct = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  const product = new Product(req.body);
  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save Product in DB",
      });
    }
    return res.json(product);
  });
};

exports.updateProduct = (req, res) => {
  const product = req.product;
  product.name = req.body.name;
  product.save((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving in DB",
      });
    }
    return res.json(product);
  });
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, product) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product",
      });
    }
    return res.json({
      message: `${product.name} deleted successfully!`,
    });
  });
};
