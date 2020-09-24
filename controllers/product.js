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

exports.getAllProducts = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let page =
    req.query.page && parseInt(req.query.page) >= 0
      ? parseInt(req.query.page)
      : 0;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let totalCount = 0;
  await Product.estimatedDocumentCount({}, (err, count) => {
    totalCount = count;
  });
  Product.find()
    .sort([[sortBy, "desc"]])
    .limit(limit)
    .skip(page)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "Product not Found!",
        });
      }
      return res.json({ products, totalCount });
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
  Product.findOneAndUpdate({ _id: req.product._id }, req.body, {
    new: true,
    useFindAndModify: false,
  }).exec((err, prod) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving in DB",
      });
    }
    return res.json(prod);
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
