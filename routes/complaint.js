const express = require("express");
const router = express.Router();

const {
  getComplaintById,
  createComplaint,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
} = require("../controllers/complaint");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { check } = require("express-validator");

// params
router.param("userId", getUserById);
router.param("complaintId", getComplaintById);

// routes
// post
router.post(
  "/complaint/create/:userId",
  [check("mobileNo", "Mobile No Must be a Number").isInt()],
  isSignedIn,
  isAuthenticated,
  createComplaint
);

// get
router.get("/complaint/:complaintId", isSignedIn, getComplaint);
router.get("/complaints", isSignedIn, getAllComplaints);

// put
router.put(
  "/complaint/:complaintId/:userId",
  isSignedIn,
  isAuthenticated,
  updateComplaint
);

// delete
router.delete(
  "/complaint/:complaintId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteComplaint
);

module.exports = router;
