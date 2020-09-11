const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    marketPrice: {
      type: Number,
      required: true,
    },
    shopPrice: {
      type: Number,
      required: true,
    },
    soldPrice: {
      type: Number,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
