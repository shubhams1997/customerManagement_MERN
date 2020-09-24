const Complaint = require("../models/complaint");
const { validationResult } = require("express-validator");

exports.getComplaintById = (req, res, next, id) => {
  Complaint.findById(id).exec((err, complaint) => {
    if (err || !complaint) {
      return res.status(400).json({
        error: "No Complaint Found!",
      });
    }
    req.complaint = complaint;
    next();
  });
};

exports.createComplaint = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const complaint = new Complaint(req.body);
  complaint.save((err, complaint) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save Complaint in DB",
      });
    }
    return res.json(complaint);
  });
};

exports.getComplaint = (req, res) => {
  return res.json(req.complaint);
};

exports.getAllComplaints = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let page =
    req.query.page && parseInt(req.query.page) >= 0
      ? parseInt(req.query.page)
      : 0;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let totalCount = 0;
  await Complaint.estimatedDocumentCount({}, (err, count) => {
    totalCount = count;
  });
  Complaint.find()
    .sort([[sortBy, "desc"]])
    .limit(limit)
    .skip(page)
    .exec((err, complaints) => {
      if (err || !complaints) {
        return res.status(400).json({
          error: "No Complaint Found!",
        });
      }
      return res.json({ complaints, totalCount });
    });
};

exports.updateComplaint = (req, res) => {
  Complaint.findOneAndUpdate({ _id: req.complaint._id }, req.body, {
    new: true,
    useFindAndModify: false,
  }).exec((err, complaint) => {
    if (err) {
      return res.status(400).json({
        error: "Error saving in DB",
      });
    }
    return res.json(complaint);
  });
};

exports.deleteComplaint = (req, res) => {
  const complaint = req.complaint;
  complaint.remove((err, complaint) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete complaint",
      });
    }
    return res.json({
      message: `${complaint.name} deleted successfully!`,
    });
  });
};
