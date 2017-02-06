const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
	hostname: { type: String, unique: true }, 
	name: String,
	ip: String,
	createdAt: {type: Date, default: Date.now}
}); 

const client = mongoose.model('client', clientSchema);

module.exports = client;
