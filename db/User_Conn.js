var mongoose = require('mongoose');
var dbConfig = require('./../db');

module.exports = User_DB = mongoose.createConnection(dbConfig.RetailSensing, { useMongoClient: true });

User_DB.on('connected', function() {
	console.log("Successfully Connected To RetailSensing database");
});

User_DB.on('disconnected', function() {
	console.log("Disconnected From RetailSensing database");
});

User_DB.on('error', function(err) {
	console.log("UrbSense_Monitor Error: " + err);
});

var gracefulExit = function() {
	User_DB.close(function() {
		console.log("Server Terminated: (RetailSensing) Mongoose Connection Closed.");
		process.exit(0);
	});
}

//When App Is Terminated, Close DB Connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

require('../models/user');