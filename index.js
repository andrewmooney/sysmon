const express = require('express');
const mongoose = require('mongoose');
const Perf = require('./models/perf');
const Client = require('./models/client');
const bodyParser = require('body-parser');
const app = express();

const port = 80;


mongoose.connect('mongodb://localhost/sysmon');

Client.find((err, clients) => {
	if (err) {
		console.log(err);
		return 
	}

	app.set('clients', clients);	
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
	Perf.find((err, perfdata) => {
		if (err) return res.send(err);
		return res.json(perfdata);
	});
});

app.get('/api/:client', (req, res) => {
	Perf.find({'hostname': req.params.client}, (err, perfData) => {
		if (err) return res.send(err);
		return res.json(perfData);
	}).limit(3);
}) ;

app.post('/api', (req, res) => {
	perfdata = new Perf(req.body);
	perfdata.save( (err) => {
		if (err) {
			return res.status(500).send(err);
		}

		res.status(200).send("Data saved to database");	
	});
})

app.post('/api/register', (req, res) => {
	const client = new Client(req.body);
	client.save( (err) => {
		if (err) {
			return res.status(500).send(err);
		}

		res.status(200).send("New client added");	
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));