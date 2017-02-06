const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Perf = require('./models/perf');
const Client = require('./models/client');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const port = 80;


mongoose.connect('mongodb://localhost/sysmon');

Client.find((err, clients) => {
	if (err) {
		console.log(err);
		return 
	}

	app.set('clients', clients);	
});

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.render('index');
});

// app.get('/api', (req, res) => {
// 	Perf.find((err, perfdata) => {
// 		if (err) return res.send(err);
// 		return res.json(perfdata);
// 	});
// });

// app.get('/api/:client', (req, res) => {
// 	Perf.find({'hostname': req.params.client}, (err, perfData) => {
// 		if (err) return res.send(err);
// 		return res.json(perfData);
// 	}).limit(3);
// }) ;

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
	const client = new Client(req.body);
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
		console.log(pd);
		io.emit('clientdata', pd);
		perfdata = new Perf(JSON.parse(pd));
		perfdata.save( (err) => {
			if (err) {
				console.log(err);
			}
		})
	});
});



http.listen(port, () => console.log(`Listening on port ${port}`));
