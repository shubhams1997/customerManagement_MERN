const Brand = require("../models/brand");

exports.getBrandById = (req, res, next, id) => {
  Brand.findById(id).exec((err, brand) => {
    if (err || !brand) {
      return res.status(400).json({
        error: "Brand not Found",
      });
    }
    req.brand = brand;
    next();
  });
};

exports.createBrand = (req, res) => {
  const brand = new Brand(req.body);

  brand.save((err, brand) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save brand in DB",
      });
    }
    return res.json(brand);
  });
};

exports.getAllBrands = (req, res) => {
  Brand.find().exec((err, brands) => {
    if (err) {
      return res.status(400).json({
        error: "No Brand Found!",
      });
    }
    return res.json(brands);
  });
};

exports.updateBrand = (req, res) => {
  const brand = req.brand;
  brand.name = req.body.name;
  brand.save((err, brand) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to Update Brand",
      });
    }
    return res.json(brand);
  });
};

exports.deleteBrand = (req, res) => {
  const brand = req.brand;
  brand.remove((err, brand) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete brand",
      });
    }
    return res.json({
      message: `${brand.name} deleted successfully!`,
    });
  });
};
