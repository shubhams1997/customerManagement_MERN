const express = require("express");
const router = express.Router();

const {
  getComplaintById,
  createComplaint,
  getComplaint,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaint");
const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// params
router.param(":userId", getUserById);
router.param(":complaintId", getComplaintById);

// routes
// post
router.post(
  "/complaint/create/:userId",
  isSignedIn,
  isAuthenticated,
  createComplaint
);

// get
router.get("/complaint/:complaintId", isSignedIn, getComplaint);
router.get("/complaints", isSignedIn, getComplaint);

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
