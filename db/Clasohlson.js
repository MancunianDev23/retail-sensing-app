var mongoose = require('mongoose');
var dbConfig = require('./../db');

module.exports = Clasohlson = mongoose.createConnection(dbConfig.clasohlson, { useMongoClient: true });

Clasohlson.on('connected', function() {
	console.log("Successfully Connected To Clasohlson database");
});

Clasohlson.on('disconnected', function() {
	console.log("Disconnected From Clasohlson database");
});

Clasohlson.on('error', function(err) {
	console.log("Clasohlson Error: " + err);
});

var gracefulExit = function() {
	Clasohlson.close(function() {
		console.log("Server Terminated: (Clasohlson) Mongoose Connection Closed.");
		process.exit(0);
	});
}

//When App Is Terminated, Close DB Connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

require('../models/visitorData');