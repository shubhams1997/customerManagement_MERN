const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
    },
    product: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    modelNo: {
      type: String,
    },
    DOP: Date,
    description: {
      type: String,
      trim: true,
    },
    reference1: {
      type: String,
      trim: true,
    },
    reference2: {
      type: String,
      trim: true,
    },
    reference3: {
      type: String,
      trim: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
