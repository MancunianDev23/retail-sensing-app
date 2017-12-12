let express = require('express');
let router = express.Router();
//let database = require('../public/javascripts/db-connect.js');
let asyncLoop = require('node-async-loop');
let User = require('../models/user');

let isAdmin = function(req, res, next) {
	if (req.isAuthenticated() && req.user.role === "admin") {
		console.log("Adminisrative Account. Access Granted.");
		return next();
	} else {
		console.log("Only Elevated Accounts Can Access This Page");
		res.redirect('/unauthorised');
	}
};

let check = function(req, res, next) {
	console.log("Successfully Routed /admin/register");
	return next();
};


module.exports = function(passport) {
	/* GET Registration Page */
	router.get('/register', isAdmin, function(req, res) {
		res.render('register', {title: 'Client Registration', username: req.user.username});
	});

	/* POST Registration Page */
	router.post('/register', check, passport.authenticate('signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/admin/register',
		session: false,
		failureFlash: true
	}));

	/* GET Users Page */
	router.get('/users', isAdmin, function(req, res) {
		database.getUsers(function(err, userArray) {
			if (err) console.error(err);
			res.render('users', {
				title: 'Users',
				username: req.user.username,
				users: userArray,
				role: req.user.role
			});
		});
	});

    /* POST Users Page */
    router.post('/update-user', isAdmin, function(req, res, next) {
        var selectedDetails = JSON.parse(req.body.userSelected);
        var updatedDetails = JSON.parse(req.body.newUserData);

        if(selectedDetails.username === updatedDetails.username){
            //Update Document
            User.findOne({username: updatedDetails.username}, function(err, doc) {
                if (err) { console.log(err);}
                User.update(
                    {username: selectedDetails.username},
                    {$set: {
                    	email: updatedDetails.email,
						role: updatedDetails.role,
						database: updatedDetails.database,
						collections: updatedDetails.collections
                    	}
					},
                    {multi: false},
                    function(err, numberAffected) {
                        if (err) throw err;
                        console.log("Updated User!");
                        res.status(200).redirect('/admin/users');
                    }
                );

            });
        }

    });


	/* POST Delete User */
	router.post('/delete-user', isAdmin, function(req, res) {
	    let userToDelete = req.body.userToDelete;
        let user = JSON.parse(userToDelete);
		User.findByIdAndRemove(user._id, function(err, user){
			if (err) {
			    console.log(err);
			} else {
			    console.log("Deleted User: " + user);
            }
			res.status(200).redirect('/admin/users');
		});
	});


	/* POST AJAX Change Database */
	router.post('/change-database', function(req, res) {
        let db = req.body.dbname;
        let coll = req.body.collections;
		console.log(coll);

		if (coll.length === 1) {
			database.getData(db, coll[0], function(err, data) {
				if (err) { console.log(err); }
				res.send(JSON.parse(data));
			});
		} else {
            let datasets = [];
			asyncLoop(coll, function(collection, next) {
				database.getData(db, collection, function(err, data) {
					if (err) { console.log(err); }
					datasets.push(JSON.parse(data));
					next();
				});
			}, function(err) {
				if (err) { console.log(err); }
				res.send(datasets);
			});
		}
	});

	/* POST AJAX Get Journey Weather Data */
	router.post('/get-weather-data', function(req, res) {
        let db = req.body.dbname;
		database.getWeatherData(db, function(err,data) {
			if (err) { console.log(err) }
			res.send(JSON.parse(data));
		});
	});

	/* POST AJAX Get Shift Data */

	return router;
};