const mongoose = require('mongoose');

const diplomaSchema = mongoose.Schema({
	name: { type: String, required: true },
	competition: { type: String, required: true },
	userID: { type: Number, required: false },
	category: { type: String, required: true },
});

const Diploma = mongoose.model('diploma', diplomaSchema)
module.exports = Diploma;