const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Perf = require('./models/perf');
const Client = require('./models/client');
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');

const port = 80;

app.engine('handlebars', exhbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/sysmon');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	Client.find((err, clients) => {
		if (err) {
			console.log(err);
			return 
		}

		res.render('index',{'client' : clients});
	});
});

// app.get('/api', (req, res) => {
// 	Perf.find((err, perfdata) => {
// 		if (err) return res.send(err);
// 		return res.json(perfdata);
// 	});
// });

app.get('/:client', (req, res) => {
	Perf.find({'name': req.params.client}, (err, perfData) => {
		if (err) return res.send({'message' : err});
		return res.render('client', {'perfData' : perfData});
	}).sort({timestamp: -1});
});

app.get('/api/:client', (req, res) => {
	const date = new Date();
	const days = 10;
	const htime = + new Date(date.getTime() - (9 * 60 * 60 * 25 * 1000));
	Perf.find({ $and: [ {'name': req.params.client}, { timestamp: { $gte: htime} }] }, (err, perfData) => {
		if (err) return res.send({'message' : err});
		return res.json(perfData);
	});
}) ;

// app.post('/api', (req, res) => {
// 	perfdata = new Perf(req.body);
// 	perfdata.save( (err) => {
// 		if (err) {
// 			return res.status(500).send(err);
// 		}

// 		res.status(200).send("Data saved to database");	
// 	});
// });

app.post('/api/register', (req, res) => {
	const body = req.body;
	body.name = body.hostname.split('.')[0];
	const client = new Client(body);
	client.save( (err) => {
		if (err) {
			return res.status(500).send(err);
		}

		res.status(200).send("New client added");	
	});
});

io.on('connection', (socket) => {
	console.log("Client connected");
	socket.on('clientpd', (pd) => {
		// console.log(pd);
		io.emit('clientdata', pd);
		perfdata = new Perf(JSON.parse(pd));
		perfdata.name = perfdata.hostname.split('.')[0];
		perfdata.save( (err) => {
			if (err) {
				console.log(err);
			}
		})
	});
});



http.listen(port, () => console.log(`Listening on port ${port}`));
