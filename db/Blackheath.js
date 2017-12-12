var mongoose = require('mongoose');
var dbConfig = require('./../db');

module.exports = Blackheath = mongoose.createConnection(dbConfig.blackheath_lib, { useMongoClient: true });

Blackheath.on('connected', function() {
	console.log("Successfully Connected To Blackheath_Lib database");
});

Blackheath.on('disconnected', function() {
	console.log("Disconnected From Blackheath_Lib database");
});

Blackheath.on('error', function(err) {
	console.log("Blackheath_Lib Error: " + err);
});

var gracefulExit = function() {
	Blackheath.close(function() {
		console.log("Server Terminated: (Blackheath_Lib) Mongoose Connection Closed.");
		process.exit(0);
	});
}

//When App Is Terminated, Close DB Connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

require('../models/visitorData');