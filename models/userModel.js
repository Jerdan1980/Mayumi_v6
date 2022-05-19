const mongoose = require('mongoose');

const diplomaSchema = mongoose.Schema({
	name: { type: String, required: true },
	tier: { type: String, required: true },
	userID: { type: Number, required: true },
	yearJoined: { type: Number, required: true },
	participantID: { type: String }
});

const Diploma = mongoose.model('diploma', diplomaSchema)
module.exports = Diploma;