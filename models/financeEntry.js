const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const financeEntrySchema = mongoose.Schema(
  {
    record: {
      type: ObjectId,
      ref: "Finance",
    },
    particular: {
      type: String,
      required: true,
      trim: true,
    },
    pending: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FinanceEntry", financeEntrySchema);
