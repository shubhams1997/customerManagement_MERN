const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const dueSchema = new mongoose.Schema({
	finance: {
		type: ObjectId,
		ref: 'Finance',
		required: true,
		unique: true
	},
	amount: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Due', dueSchema);
