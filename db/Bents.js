var mongoose = require('mongoose');
var dbConfig = require('./../db');

module.exports = Bents = mongoose.createConnection(dbConfig.bents_garden, { useMongoClient: true });

Bents.on('connected', function() {
	console.log("Successfully Connected To Bents_Garden database");
});

Bents.on('disconnected', function() {
	console.log("Disconnected From Bents_Garden database");
});

Bents.on('error', function(err) {
	console.log("Bents_Garden Error: " + err);
});

var gracefulExit = function() {
	Bents.close(function() {
		console.log("Server Terminated: (Bents_Garden) Mongoose Connection Closed.");
		process.exit(0);
	});
}

//When App Is Terminated, Close DB Connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

require('../models/visitorData');