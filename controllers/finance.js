const Finance = require('../models/finance');
const FinanceEntry = require('../models/financeEntry');
const { validationResult } = require('express-validator');
const finance = require('../models/finance');

exports.getFinanceById = (req, res, next, id) => {
	Finance.findById(id).exec((err, finance) => {
		if (err || !finance) {
			return res.status(400).json({
				error: 'Finance Statement not Found!'
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
	const pending =
		parseInt(req.body.price) +
		parseInt(req.body.processingFee) -
		parseInt(req.body.downPayment) +
		parseInt(req.body.interest) * parseInt(req.body.months);
	const finance = new Finance({ ...req.body, pending });
	finance.save((err, finance) => {
		if (err) {
			return res.status(400).json({
				error: 'Error in Saving Statement in DB'
			});
		}
		const grossAmount = finance.price + finance.processingFee - finance.downPayment;
		const financeEntry = new FinanceEntry({
			finance: finance._id,
			date: new Date(),
			particular: `Finance Created for customer ${finance.name}`,
			amount: grossAmount
		});
		financeEntry.save((err, entry) => {
			if (err) {
				return res.status(400).json({
					error: 'Error in Saving first Statement in DB'
				});
			}
			return res.json({ message: 'created successfully' });
		});
	});
};

exports.getFinance = (req, res) => {
	return res.json(req.finance);
};

exports.getAllFinance = (req, res) => {
	Finance.find({ seriesNo: req.series._id })
		.sort([ [ '_id', 'desc' ] ])
		.select('_id name DOP dueDate caseNo mobileNo pending')
		.exec((err, finances) => {
			if (err) {
				return res.status(400).json({
					error: 'No Statement Found!'
				});
			}
			return res.json(finances);
		});
};

// finance Entry

// create Entry
exports.createEntry = (req, res) => {
	const financeEntry = new FinanceEntry(req.body);
	financeEntry.save((err, entry) => {
		if (err) {
			return res.status(400).json({
				error: 'Error in Saving Entry in DB'
			});
		}
		Finance.findByIdAndUpdate(
			{ _id: req.body.finance },
			{ $inc: { pending: -req.body.amount } },
			{ new: true, userFindAndModify: false },
			(err, finance) => {
				if (err) {
					return res.status(400).json({
						error: 'Finance Statement not Found!'
					});
				}
				return res.json({ message: 'payment successfull' });
			}
		);
	});
};

// get entries
exports.getEntries = (req, res) => {
	FinanceEntry.find({ finance: req.finance._id }).exec((err, entries) => {
		if (err) {
			return res.status(400).json({
				error: 'No Entry Found with this Finance Id'
			});
		}
		return res.json(entries);
	});
};
