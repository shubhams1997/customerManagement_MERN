const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// imports
const {
	createFinance,
	getFinanceById,
	getFinance,
	getAllFinance,
	getEntries,
	createEntry
} = require('../controllers/finance');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const { getSeriesById } = require('../controllers/series');

// params
router.param('userId', getUserById);
router.param('financeId', getFinanceById);
router.param('seriesId', getSeriesById);

// routes

// post
router.post('/finance/create/:userId', isSignedIn, isAuthenticated, createFinance);

router.post(
	'/financeEntry/create/:userId',
	[
		check('particular', 'Particular is Needed').isLength({ min: 1 }),
		check('debit', 'Debit field should be provided with some Amount').isNumeric(),
		check('credit', 'Credit field should be provided with some Amount').isNumeric()
	],
	isSignedIn,
	isAuthenticated,
	createEntry
);

// get
router.get('/finance/:financeId', isSignedIn, getFinance);
router.get('/finances/:seriesId', isSignedIn, getAllFinance);

router.get('/financeEntries/:financeId', isSignedIn, getEntries);
module.exports = router;
