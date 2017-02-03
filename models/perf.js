const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const perfSchema = new Schema({
	hostname: String, 
	timestamp: Number,
	cpu_perc: Number,
	vmem_perc: Number,
	smem_perc: Number
}); 

const perf = mongoose.model('PerfData', perfSchema);

module.exports = perf;
