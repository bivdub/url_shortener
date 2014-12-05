var express = require('express');
var bodyParser = require('body-parser');
var db = require('./models/index.js');
var app = express();
var Hashids = require('hashids');
hashids = new Hashids('salty macsalterton');


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
	res.render('index');
});

app.post('/create', function (req, res) {
		db.Url.findOrCreate({where: {url: req.body.enteredUrl}}).done(function(error, data, created) {
		console.log(created);
		if(created) {
		console.log('here2');
			var newHash = hashids.encode(data.id);
			data.hash = newHash;
			data.save().done(function (error, data) {
				res.render('./created', {data: data});
			})
		} else {
		console.log('here3');
			res.render('./created', {data: data});
		}

	})
});

app.get('/:hash', function (req, res) {
	db.Url.find({where: {hash: req.params.hash} }).done(function (error, data) {
		res.redirect("http://"+data.url);
	});
});

app.listen(3000);