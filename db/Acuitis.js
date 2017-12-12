var mongoose = require('mongoose');
var dbConfig = require('./../db');

module.exports = Acuitis = mongoose.createConnection(dbConfig.acuitis, { useMongoClient: true });

Acuitis.on('connected', function() {
	console.log("Successfully Connected To Acuitis database");
});

Acuitis.on('disconnected', function() {
	console.log("Disconnected From Acuitis database");
});

Acuitis.on('error', function(err) {
	console.log("Acuitis Error: " + err);
});

var gracefulExit = function() {
	Acuitis.close(function() {
		console.log("Server Terminated: (Acuitis) Mongoose Connection Closed.");
		process.exit(0);
	});
}

//When App Is Terminated, Close DB Connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

require('../models/visitorData');