const Finance = require('../models/finance');
const FinanceEntry = require('../models/financeEntry');
const Due = require('../models/due');
const { validationResult } = require('express-validator');

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

exports.getDueById = (req, res, next, id) => {
	Due.findById(id).exec((err, due) => {
		if (err || !due) {
			return res.status(400).json({
				error: 'Due not found'
			});
		}
		req.due = due;
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
		const financeEntry = new FinanceEntry({
			finance: finance._id,
			date: new Date(),
			particular: `Finance Created for customer ${finance.name}`,
			amount: pending
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

// Due
// create due
const createDue = () => {
	Finance.find({}).exec((err, finances) => {
		if (err) {
			console.log('Error while processing the finance list ');
		} else {
			finances.forEach((finance) => {
				const date = new Date(`${finance.dueDate}`);
				const today = new Date();
				if (date.getDate() == today.getDate() && finance.pending > 0) {
					const due = new Due({ finance: finance._id });
					due.save((err, d) => {
						if (err) {
							console.log(`Finance due already added for ${finance.name}`);
						} else {
							console.log(`due is added for finance ${finance.name}`);
						}
					});
				}
			});
		}
	});
};

setInterval(() => {
	createDue();
}, 5000000);

exports.getAllDues = (req, res) => {
	Due.find({}).populate('finance', '_id name dueDate mobileNo pending ').exec((err, dues) => {
		if (err) {
			return res.status(400).json({
				error: 'Can not fatch dues'
			});
		}
		return res.json(dues);
	});
};

exports.deleteDue = (req, res) => {
	const due = req.due;
	due.remove((err, due) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to delete Due'
			});
		}
		return res.json({
			message: `${due.name} deleted successfully!`
		});
	});
};
