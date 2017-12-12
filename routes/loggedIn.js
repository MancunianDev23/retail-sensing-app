let express = require('express');
let router = express.Router();
//let database = require('../public/javascripts/db-connect.js');
//let moment = require('moment');
let async = require('async');
let asyncLoop = require('node-async-loop');
let mongoose = require('mongoose');
let fs = require('fs');
let dataDir = 'public/data/';
let uri = require('../db.js');
let files;
let prevWeek = [];
// Used when determining the folder to browse through (depending on the company)
let company;
// Date and data (used by the daily/weekly/monthly vis pages)
let date;
let data, fileType;
// Database connections
let Acuitis = require('../db/Acuitis.js');
let Bents = require('../db/Bents.js');
let Blackheath = require('../db/Blackheath.js');
let Clasohlson = require('../db/Clasohlson.js');

let isAuthenticated = function(req, res, next) {
    /*
    let session = req.session['cookie'];
    console.log(session);
    console.log(new Date(session._expires));
    console.log(new Date());

    if (session && new Date(session._expires) < new Date() + session.originalMaxAge) {
        console.log("Session Expired!");
        res.render('error', {
        	title: "Session Timeout!",
			error: "Unauthorised Access!",
			message: "Your session has timed out. Please sign-in again."
		});

        return next();
    }*/
	if (req.isAuthenticated()) {
		console.log("User " + req.user.username + " authenticated.");
		return next();
	} else {
		res.redirect('/unauthorised');
	}
};


// Asynchronous waterfall functions - Get a list of databases on a server and then get a list of collections from each
/*async.waterfall([
	function(callback){
		getDatabases(function(err, data){
			if(err){ callback(err, null);}
			callback(null, data);
		});
	},
	function(databases, callback){
		let colls;
		let collects = [];
		asyncLoop(databases, function(item, next){
			getCollections(item, function(err, collections){
				if(err){callback(err, databases, null);} // (err 2nd, databases 1st function, null -callback 2nd function)
				colls = collections;
				collects.push(colls);
				console.log(collections);
				next();
			});
		});
		callback(null, databases, colls);
	}
], function(err, databases, collections){
	if(err){ console.log('Error'+ err);}
	console.log(collections);
});

//getCollections('bents_garden', function(err, res){
	//console.log(res);
//});

function getDatabases(callback){
	let admin = mongoose.createConnection(uri.admin, { useMongoClient: true });
	admin.on('connected', function(){
		new mongoose.mongo.Admin(admin.db).listDatabases(function(err, res){
			if(err){console.log(err);}
			let name = [];
			for(let i =0; i< res.databases.length; i++){
				if(res.databases[i].name !== "admin" && res.databases[i].name !== "local" && res.databases[i].name !== "dog_walker"){
					name.push(res.databases[i].name);
				}
			}
			callback(null, name);
		});
	});
}

function getCollections(db, callback){
	let admin = mongoose.createConnection(uri.connString(db), { useMongoClient: true });
	console.log(admin.base.modelSchemas); //admin.base.modelSchemas.User.obj.username;
	admin.on('connected', function(){
		admin.db.listCollections().toArray(function(err, res){
			if(err){console.log(err);}
			let colls = [];
			for(let i=0; i< res.length; i++){
				colls.push(res[i].idIndex.ns);
			}
			callback(null, colls);
		});
	});
}*/

function displayUsername(username) {
	document.getElementById('login-username').innerHTML = username.toString();
}

function getWeek(){
    //Get today's date and convert it to the filename compatible format
    let today = new Date();
    let todayDay = today.getDate();
    let todayMonth = (today.getMonth() + 1);
   	let todayYear = today.getFullYear().toString().substr(2, 2);
    if(todayDay < 10){
    	todayDay = "0"+ todayDay;
    }
    if(todayMonth < 10){
    	todayMonth = "0"+ todayMonth;
    }
    today = todayDay + todayMonth + todayYear;

    for(var i=7; i > 0; i--){
    	weekDay = (todayDay - i);
    	if(weekDay < 10){
    		weekDay = "0"+ weekDay;
    	}
    	prevWeek.push(weekDay.toString() + todayMonth.toString() + todayYear.toString());
    }
}

// Receives string which contains filename & date in a row format. This function takes care of the date extraction and formatting
function getDates(filename){
	var file, fileDate;
	var day, month, year;
	/*if(filename.indexOf('_') !== -1){
		fileDate = filename.split('_');
		if(fileDate[1].indexOf('CALC') !== -1){
			date = fileDate[1].substring(4, fileDate[1].length -1);

			day = date.substring(0,2);
			month = date.substring(2,4);
			year = date.substring(4,6);

			date = day + "/" + month + "/" + year;

		}else if(fileDate[1].indexOf('MONTH') !== -1){
			date = fileDate[1].substring(5, fileDate[1].length -1);

			month = date.substring(0,2);
			year = date.substring(2,4);

			date = month + "/" + year;
		}
		console.log('File containing _ in the name has been ignored');
		*/
	if(filename.indexOf('_') < 0){
		file = filename.replace('.wl', '');
		fileDate = file.slice(-6);
		day = fileDate.substring(0,2);
		month = fileDate.substring(2,4);
		year = fileDate.substring(4,6);

		date = month + "/" + day + "/" + year;

		return date;
	}
	return null;
}

module.exports = function(passport) {
    //Routes /main --> home.pug
    router.get('/', isAuthenticated, function(req, res, next) {
    	res.render('index', {
			title: 'User Homepage',
			username: req.user.username,
			role: req.user.role
		});
	});

    //Routes /index/daily-count --> daily-vis.pug
    router.get('/daily-count', isAuthenticated, function(req, res) {
    	// Data to be sent to the vis pages
		let dailyVisitor = [];
    	// Detect the user's database and set the directory to look for the .wl documents in
    	if(req.user.database == 'admin'){
    		company = 'bents_garden';
    	}else{
    		company = req.user.database;
    	}
    	// Look through the directory to read from
    	files = fs.readdirSync(dataDir + company);
    	files.forEach(function(file) {
    		/*if(file.indexOf('_') !== -1){
	    		fileType = file.split('_');
	    		if(fileType[1].indexOf('MONTH') < 0){
					// Read each file that doesn't contain the word MONTH in the filename - synchronously
					data = fs.readFileSync(dataDir + company + '/' + file, 'utf8');
					// Extract a formatted date from the filename
					getDates(file);
					
					// Array containing the date and contents of all processed files
					dailyVisitor.push({
						date: date,
						count: data
					});
				}
				console.log('File containing _ in the name has been ignored');*/
    		if(fs.statSync(dataDir + company + '/' + file).isDirectory() == false && file.indexOf('_') < 0){
    			data = fs.readFileSync(dataDir + company + '/' + file, 'utf8');
				// Extract a formatted date from the filename
				getDates(file);
				// Array containing the date and contents of all processed files
				dailyVisitor.push({
					date: date,
					count: data
				});
    		}
		});

    	var jsonObj = JSON.stringify(dailyVisitor);
		res.render('dataPages/daily-vis', {
			title: 'Daily Visitor Count',
			username: req.user.username,
			role: req.user.role,
			data: jsonObj
		});
    });

    //Routes /index/weekly-count --> weekly-vis.pug
    router.get('/weekly-count', isAuthenticated, function(req, res, next) {
    	// Data to be sent to the vis pages
		let dailyVisitor = [];
    	// Detect the user's database and set the directory to look for the .wl documents in
    	getCompany(req.user.database);
    	// Look through the directory to read from
    	files = fs.readdirSync(dataDir + company);
    	files.forEach(function(file) {
    		fileType = file.split('_');
    		if(fileType[1].indexOf('MONTH') < 0){
				// Read each file that doesn't contain the word MONTH in the filename - synchronously
				data = fs.readFileSync(dataDir + company + '/' + file, 'utf8');
				// Extract a formatted date from the filename
				getDates(file);
				
				// Array containing the date and contents of all processed files
				dailyVisitor.push({
					date: date,
					count: data
				});
    		}
		});
		res.render('dataPages/weekly-vis', {
			title: "Weekly Visitor Count",
			username: req.user.username,
			role: req.user.role,
		});
    });

	//Routes /index/weekly-count --> weekly-vis.pug
    router.get('/monthly-count', isAuthenticated, function(req, res, next) {
    	// Data to be sent to the vis pages
		let dailyVisitor = [];
    	// Detect the user's database and set the directory to look for the .wl documents in
    	getCompany(req.user.database);
    	// Look through the directory to read from
    	files = fs.readdirSync(dataDir + company);
    	files.forEach(function(file) {
    		fileType = file.split('_');
    		if(fileType[1].indexOf('MONTH') !== -1){
				// Read each file that doesn't contain the word MONTH in the filename - synchronously
				data = fs.readFileSync(dataDir + company + '/' + file, 'utf8');
				// Extract a formatted date from the filename
				getDates(file);
				
				// Array containing the date and contents of all processed files
				dailyVisitor.push({
					date: date,
					count: data
				});
    		}
		});
		res.render('dataPages/monthly-vis', {
			title: "Monthly Visitor Count",
			username: req.user.username,
			role: req.user.role,
		});
    });

	/* Routes /dashboard/real-time --> rt_bus_data.pug */
	router.get('/real-time', isAuthenticated, function(req, res, next) {
		res.render('dataPages/real-time-vis.pug', {
			title: "Real Time Data",
			username: req.user.username,
			role: req.user.role,
		});
	});

	/* Routes /dashboard/real-time --> comparison.pug*/
	router.get('/conversion', isAuthenticated, function(req, res) {
		res.render('data-vis/conversion', {
			title: 'Conversion Ratio',
			username: req.user.username,
			databases: dbs,
			clientDb: req.user.database,
			role: req.user.role
		});
	});


    router.post('/saveDb', isAuthenticated, function(req, res, next) {
    	let data = req.body.data;
    	let totals = {};
    	
    	for(let i=0; i < data.length; i++){
    		const keys = Object.keys(data[i]);
    		for (let j = 0; j < keys.length; j++) {
				if([keys[j]] != "Time"){
					totals[keys[j]] = parseInt(data[i][keys[j]]);
				}
    		}
    	}

    	// Totals for each camera per day
    	/*for(let i=0; i < data.length; i++){
    		const keys = Object.keys(data[i]);
    		for (let j = 0; j < keys.length; j++) {
				if (!totals.hasOwnProperty(keys[j])) {
					totals[keys[j]] = parseInt(data[i][keys[j]]);
				} else {
					totals[keys[j]] += parseInt(data[i][keys[j]]);
				}

    		}
    	}
    	console.log(totals);*/
    });

	return router;
};