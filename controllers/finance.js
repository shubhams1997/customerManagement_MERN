const Finance = require("../models/finance");
const FinanceEntry = require("../models/financeEntry");
const { validationResult } = require("express-validator");

exports.getFinanceById = (req, res, next, id) => {
  Finance.findById(id).exec((err, finance) => {
    if (err || !finance) {
      return res.status(400).json({
        error: "Finance Statement not Found!",
      });
    }
    req.finance = finance;
    next();
  });
};

exports.createFinance = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  const finance = new Finance(req.body);
  finance.save((err, finance) => {
    if (err) {
      return res.status(400).json({
        error: "Error in Saving Statement in DB",
      });
    }
    const grossAmount =
      finance.price + finance.processingFee - finance.downPayment;
    const financeEntry = new FinanceEntry({
      record: finance._id,
      date: new Date(),
      particular: `Finance Created for customer ${finance.name}`,
      debit: grossAmount,
      credit: grossAmount,
    });
    financeEntry.save((err, entry) => {
      if (err) {
        return res.status(400).json({
          error: "Error in Saving first Statement in DB",
        });
      }
      return res.json(finance);
    });
  });
};

exports.getFinance = (req, res) => {
  return res.json(req.finance);
};

exports.getAllFinance = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let page =
    req.query.page && parseInt(req.query.page) >= 0
      ? parseInt(req.query.page)
      : 0;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let totalCount = 0;
  await Finance.estimatedDocumentCount({}, (err, count) => {
    totalCount = count;
  });
  Finance.find()
    .sort([[sortBy, "desc"]])
    .limit(limit)
    .skip(page)
    .exec((err, finances) => {
      if (err) {
        return res.status(400).json({
          error: "No Statement Found!",
        });
      }
      return res.json({ finances, totalCount });
    });
};

// finance Entry

// create Entry
exports.createEntry = (req, res) => {
  console.log(req.body);
  const financeEntry = new FinanceEntry(req.body);
  financeEntry.save((err, entry) => {
    if (err) {
      return res.status(400).json({
        error: "Error in Saving Entry in DB",
      });
    }
    return res.json(entry);
  });
};

// get entries
exports.getEntries = (req, res) => {
  FinanceEntry.find({ record: req.finance._id }).exec((err, entries) => {
    if (err) {
      return res.status(400).json({
        error: "No Entry Found with this Finance Id",
      });
    }
    return res.json(entries);
  });
};
