const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 60
		},
		description: {
			type: String,
			trim: true,
			maxlength: 250
		},
		marketPrice: {
			type: Number
		},
		dealerPrice: {
			type: Number,
			required: true
		},
		salesPrice: {
			type: Number,
			required: true
		},
		incentive: {
			type: Number,
			required: true
		},
		landingPrice: {
			type: Number,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		brand: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
