const Mongoose = require('mongoose');
const Admin = Mongoose.mongo.Admin;

//Mognoose Models
const Users = require('./../../models/user.js');

const JourneyData = require('./../../models/journeydata.js');
const JourneyData_Novas_vn = JourneyData.Novas_vn;
const JourneyData_mahendra = JourneyData.mahendra;
const JourneyData_inari_library = JourneyData.inari_library;
const JourneyData_TfGM = JourneyData.TfGM;

const Weather = require('./../../models/weather.js');
const Weather_Novas_vn = Weather.Novas_vn;
const Weather_mahendra = Weather.mahendra;
const Weather_inari_library = Weather.inari_library;

const ShiftTotals = require('./../../models/shifttotals.js');
const ShiftTotals_Novas_vn = ShiftTotals.Novas_vn;
const ShiftTotals_mahendra = ShiftTotals.mahendra;
const ShiftTotals_inari_library = ShiftTotals.inari_library;

const ShiftTimes = require('./../../models/shift_times.js');
const ShiftTimes_Novas_vn = ShiftTimes.Novas_vn;
const ShiftTimes_mahendra = ShiftTimes.mahendra;
const ShiftTimes_inari_library = ShiftTimes.inari_library;

const BusData = require('./../../models/busdata.js');
const BusData_Novas_vn = BusData.Novas_vn;
const BusData_mahendra = BusData.mahendra;
const BusData_inari_library = BusData.inari_library;

const AppBusData = require('./../../models/app_busdata');
const AppBusData_Novas_vn = AppBusData.Novas_vn;
const AppBusData_mahendra = AppBusData.mahendra;
const AppBusData_inari_library = AppBusData.inari_library;

const db_by_client = require('./../../models/db_by_client.js');
const db_by_client_UrbSense_Monitor = db_by_client.UrbSense_Monitor;


/* NEW STYLE MONGOOSE CONNECTIONS */
exports.getData = function getJourneyData(database, collection, callback) {
	let db = eval(collection + "_" + database);
	db.find().exec({}, function(err, data) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.stringify(data));
		}
	});
};

exports.getUsers = function getUsers(callback) {
	Users.find().exec({}, function(err, users) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.stringify(users));
		}
	});
};

exports.getDocumentCount = function getDocumentCount(database, callback) {
	console.log(database);
	let collection = eval("JourneyData_" + database);
	collection.count({}, function(err, count) {
		if (err) {
			callback(err, null); 
		} else {
			callback(null, count);
		}
	});
};

exports.getShiftTotalData = function getShiftTotalData(database, collection, filter, callback) {
	let db = eval(collection + "_" + database);
	db.find(filter, function(err, shifttotals) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.stringify(shifttotals));
		}
	});
};

exports.getShiftTimesData = function getShiftTimesData(callback) {
	ShiftTimes_Novas_vn.find().exec({}, function(err, shift_times) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.stringify(shift_times));
		}
	});
};

exports.getWeatherData = function getWeatherData(database, callback) {
	let db = eval("Weather_" + database);
	db.find().exec({}, function(err, weather) {
		if (err) callback(err, null);
		callback(null, JSON.stringify(weather));
	});
};

exports.getDatabaseNames = function getDatabaseNames(callback) {
	db_by_client_UrbSense_Monitor.find().exec({}, function(err, dbs) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.stringify(dbs));
		}
	});
};

exports.addData = function addData(data, database, collection) {
	const db = eval(collection + "_" + database);
	for (let i = 0; i < data.length; i++) {
		let doc = new db(data[i]);
		doc.save(function(err, results) {
		    console.log(results._id + " added.");
        });
	}
};