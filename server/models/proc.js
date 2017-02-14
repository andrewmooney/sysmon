const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const procSchema = new Schema({
	hostname: String, 
	name: String,
	timestamp: Number,
        pid: Number, 
        pname: String, 
        pstatus: String, 
        puser: String
}); 

const proc = mongoose.model('ProcData', procSchema);

module.exports = proc;
