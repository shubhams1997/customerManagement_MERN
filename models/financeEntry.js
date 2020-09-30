const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const financeEntrySchema = mongoose.Schema(
  {
    record: {
      type: ObjectId,
      ref: "Finance",
    },
    date: {
      type: Date,
      required: true,
    },
    particular: {
      type: String,
      required: true,
      trim: true,
    },
    debit: {
      type: Number,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FinanceEntry", financeEntrySchema);
