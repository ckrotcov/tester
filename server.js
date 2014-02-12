//jesse@remind101.com
var express = require('express');
var handlebars = require('handlebars');
var mongo = require('mongodb');
var monk = require('monk');
var request = require("request");

var db = monk('localhost:27017/shipwire');


var API_URL = "https://api.remind101.com";

var app = express();
app.use(express.bodyParser());

app.configure(function(){
	app.use('/css', express.static(__dirname + '/css'));
	app.use('/js', express.static(__dirname + '/js'));	
});


app.get("/", function (req, res) {
	res.sendfile(__dirname + '/index.html');
});


app.post("/login", function (req, res) {
	var formDict = {"user[email]": req.param("email"), "user[password]": req.param("password")};
	
	request.post({
				uri: "https://api.remind101.com/v2/access_tokens",
				form: formDict,
			}, function (error, response, body) {
				if (!error) {
				res.send(response.body); 
			  } else {
				res.send(error);
			  }
		});	
});

app.get("/messages", function (req, res) {
	var token = req.param("token");
	console.log("https://api.remind101.com/v2/messages?auth_token=" + token);
	request.get({
					uri: "https://api.remind101.com/v2/messages?auth_token=" + token,
				}, function (error, response, body) {
					if (!error) {
						console.log(response.body);
					res.send(response.body); 
				  } else {
					res.send(error);
				  }
			});	
});


app.listen(8000);
console.log('Listening on port 8000');
