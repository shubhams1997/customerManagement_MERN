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

exports.getEntryById = (req, res, next, id) => {
	FinanceEntry.findById(id).exec((err, entry) => {
		if (err || !entry) {
			return res.status(400).json({
				error: 'Entry not Found'
			});
		}
		req.entry = entry;
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
			date: finance.DOP,
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
				Due.deleteOne({ finance: finance._id }).exec((err, due) => {
					if (err) {
						console.log('DELEtion ERROR');
						return res.status(400).json({
							error: 'Payment Successfull and no due found!'
						});
					}
					const v = createDue(true);
					console.log('DUE RECREATED ');
					if (v)
						return res.json({
							message: `Payment Successfull!`
						});
				});
				// return res.json({ message: 'payment successfull' });
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

exports.getAllEntries = (req, res) => {
	const today = new Date();
	today.setDate(today.getDate() - 5);
	FinanceEntry.find({
		date: { $gte: today }
	}).exec((err, entries) => {
		if (err) {
			return res.status(400).json({
				error: 'Error is Fatching Entries'
			});
		}
		return res.json(entries);
	});
};

// Due

function monthDiff(d1, d2) {
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth();
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
}

// create due
const createDue = async (skip) => {
	Finance.find({}).exec((err, finances) => {
		if (err) {
			console.log('Error while processing the finance list ');
		} else {
			finances.forEach((finance) => {
				const date = new Date(`${finance.dueDate}`);
				const today = new Date('2020-12-08');
				if (skip || date.getDate() == today.getDate()) {
					const { price, downPayment, processingFee, interest, months, pending } = finance;
					const netAmount =
						parseInt(price) -
						parseInt(downPayment) +
						parseInt(processingFee) +
						parseInt(interest) * parseInt(months);
					const EMI =
						(parseInt(price) -
							parseInt(downPayment) +
							parseInt(processingFee) +
							parseInt(interest) * parseInt(months)) /
						parseInt(months);
					const monthsCount = monthDiff(date, today);
					const actualMonths = monthsCount < parseInt(months) ? monthsCount : parseInt(months);
					const dueAmount = EMI * actualMonths - (netAmount - pending);
					if (pending > 0 && dueAmount > 0) {
						const due = new Due({ finance: finance._id, amount: dueAmount });
						due.save((err) => {
							if (err) {
								// console.log(`Finance due already added for ${finance.name}`);
								Due.findOneAndUpdate(
									{ finance: finance._id },
									{ $set: { amount: dueAmount } },
									{ new: true, userFindAndModify: false },
									(err, d) => {
										if (err) {
											console.log('Due update Error');
										} else {
											{
												skip && console.log('DUE UPDATED SUCCESSFULLY');
											}
										}
									}
								);
							} else {
								console.log(`due is added for finance ${finance.name}`);
							}
							return 1;
						});
					}
				}
			});
		}
	});
};
createDue(false);
setInterval(() => {
	createDue(false);
}, 3000);

exports.getAllDues = (req, res) => {
	Due.find({})
		.populate({
			path: 'finance',
			select: '_id name dueDate mobileNo pending caseNo'
		})
		.sort([ [ 'amount', 'desc' ] ])
		.exec((err, dues) => {
			if (err) {
				return res.status(400).json({
					error: 'Can not fatch dues'
				});
			}
			return res.json(dues);
		});
};

exports.updateEntry = (req, res) => {
	const entry = req.entry;
	entry.date = req.body.date;
	entry.particular = req.body.particular;
	entry.voucherNo = req.body.voucherNo;

	entry.save((err, entry) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to Update Entry'
			});
		}
		return res.json(entry);
	});
};

// exports.deleteDue = (req, res) => {
// 	const due = req.due;
// 	due.remove((err, due) => {
// 		if (err) {
// 			return res.status(400).json({
// 				error: 'Failed to delete Due'
// 			});
// 		}
// 		return res.json({
// 			message: `${due.name} deleted successfully!`
// 		});
// 	});
// };
