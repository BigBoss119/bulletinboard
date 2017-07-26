const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const SQL = require('sql-template-strings');
const client = new Client({
	database: 'bulletinboard',
  host: 'localhost',
  user: process.env.POSTGRES_USER
});

//setting up pug as the view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

//setting up static files and bodyparser
app.use(express.static(__dirname + '/../public'));
app.use('/', bodyParser.urlencoded({ extended: true }));

//ROUTES
app.get('/', function(req, res) {
	res.render('index');
});

//list all messages
app.get('/messages', function(req, res) {
	client.connect();
	client.query('select * from messages', (err, result) => {
		console.log(err ? err.stack : 'showing all messages')

		res.render('messages', {
			messages: result.rows
		});
	});
});

//post request for new messages
app.post('/send', function(req, res) {
	var newTitle = req.body.title;
	var newBody = req.body.body;

	client.connect();
	client.query(SQL`insert into messages (title, body) values (${newTitle}, ${newBody})`, (err, result) => {
		console.log(err ? err.stack : 'new message added to the database')
	});

	res.redirect('/messages');
});

//start listening
var server = app.listen(3000, function() {
	console.log('Bulletin Board listening on port: ' + server.address().port);
});
