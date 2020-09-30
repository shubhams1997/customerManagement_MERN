const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  createSeries,
  getAllSeries,
  getSeriesById,
  updateSeries,
  deleteSeries,
} = require("../controllers/series");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("seriesId", getSeriesById);

// routes
// get
router.get("/series", isSignedIn, getAllSeries);

// post
router.post(
  "/series/create/:userId",
  isSignedIn,
  isAuthenticated,
  createSeries
);

// put
router.put(
  "/series/:seriesId/:userId",
  isSignedIn,
  isAuthenticated,
  updateSeries
);

// delete
router.delete(
  "/series/:seriesId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteSeries
);

module.exports = router;
