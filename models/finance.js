const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const financeSchema = new mongoose.Schema(
	{
		seriesNo: {
			type: ObjectId,
			ref: 'Series',
			required: true
		},
		DOP: { type: Date, required: true },
		dueDate: { type: Date, required: true },
		caseNo: { type: String },
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 32
		},
		address: {
			type: String,
			required: true,
			trim: true,
			maxlength: 256
		},
		mobileNo: { type: Number, required: true },
		product: {
			type: String,
			required: true,
			trim: true,
			maxlength: 32
		},
		brand: {
			type: String,
			required: true,
			trim: true,
			maxlength: 32
		},
		price: { type: Number, required: true },
		pending: { type: Number, required: true },
		downPayment: { type: Number, required: true },
		processingFee: { type: Number, required: true },
		interest: { type: Number, required: true },
		months: { type: Number, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Finance', financeSchema);
