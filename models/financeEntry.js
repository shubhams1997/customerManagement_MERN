const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const financeEntrySchema = mongoose.Schema(
	{
		finance: {
			type: ObjectId,
			ref: 'Finance'
		},
		date: {
			type: Date,
			required: true
		},
		voucherNo: {
			type: String
		},
		particular: {
			type: String,
			required: true,
			trim: true
		},
		amount: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('FinanceEntry', financeEntrySchema);
