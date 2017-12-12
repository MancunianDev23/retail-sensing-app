var express = require('express');
var router = express.Router();
//var database = require('../public/javascripts/db-connect.js');
var User = require('../models/user');
var asyncLoop = require('node-async-loop');
var bCrypt = require('bcrypt-nodejs');

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		console.log("User " + req.user.username + " authenticated.");
		return next();
	} else {
		res.redirect('/unauthorised');
	}
}

var isAdmin = function(req, res, next) {
	if (req.isAuthenticated() && req.user.role == "admin") {
		console.log("Administrative Account. Access Granted.")
		return next();
	} else {
		console.log("Only Elevated Accounts Can Access This Page");
		res.redirect('/unauthorised');
	}
}

module.exports = function(passport) {
    /* GET Home Page - login page is the homepage for unauthorised users */
    router.get('/', function(req, res, next) {
    	//var username = ((req.isAuthenticated()) ? "<span class='fa fa-user'></span>&nbsp;" + req.user.username : "<span class='fa fa-sign-in fa-fw'></span>&nbsp; Login");
        res.render('login', {
            title: 'Login',
            message: req.flash('message'),
            error: req.flash('error')
        });
    });

    /* GET Unauthorised Page */
	router.get('/unauthorised', function(req, res, next) {
		res.render('unauthorised', {title: 'Unauthorised'});
	});

	/* GET Error Page */
	router.get('/error', function(req, res, next) {
		res.render('error', {title: 'Error'});
	});

	/* GET Profile Page */
	router.get('/profile', isAuthenticated, function(req, res, next) {
		res.render('profile', {
			title: 'User Profile',
			user: req.user,
			username: req.user.username,
			email: req.user.email,
			role: req.user.role,
		});
	});

	/* POST Login Page */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/index',
		failureRedirect: '/',
		failureFlash: true
	}));

	router.get('/register', function(req, res) {
		res.render('register', {title: 'Client Registration'});
	});

	/* POST Registration Page */
	router.post('/register', passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/register',
		session: false,
		failureFlash: true
	}));

	/* POST Change Password */
	router.post('/change-password', function(req, res, next) {
		changePassword = function() {
			User.findOne({"username": req.user.username}, function(err, user) {
		        //If Unexpected Error - Log It & Return It
		        if (err) {
		            console.log("Error: " + err);
		            return done(err, null); //Return err, no user
		        }

		        console.log(req.body.newPassword, req.body.confirmPassword);
		        if (req.body.currentPassword) {
		        	console.log("Current Password True");
		        }

		        if(passwordsMatch(req.user, req.body.currentPassword)) {
                    if (req.body.newPassword === req.body.confirmPassword) {
                        User.update(
                            {username: req.user.username},
                            {$set: {password: createHash(req.body.newPassword)}},
                            {multi: false},
                            function(err, numberAffected) {
                                if (err) throw err;
                                console.log(req.user.username + "'s password updated");
                            }
                        );
                    }
                } else {
                    console.log("Current Password Incorrect");
                }
	    	});
		};
		process.nextTick(changePassword);		

		var createHash = function(password) {
		    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
		};

		var passwordsMatch = function(user, password) {
			return bCrypt.compareSync(password, user.password);
		}
	});


	/* Handle Logout */
	router.get('/signout', function(req, res) {
		console.log(req.user);
		User.findOne({"username": req.user.username}, function(err, object) {
			if (err) { console.log(err);}
			User.update(
                {username: req.user.username},
                {$set: {loggedIn: false}},
                {multi: false},
                function(err, numberAffected) {
                    if (err) throw err;
                    console.log(req.user.username + " logged out at " + Date.now());
                    req.logout();
					res.redirect('/');
                }
            );
		});
		//username = "Login"; //Reset
	});

	/*GET Under Construction Page */
	router.get('/development', function(req, res, next) {
		res.render('under_construction', {title: "Under Construction"});
	});

	/* GET ReportingApp Page*/
	router.get('/reporting-app', function(req, res, next) {
		if (req) {
			res.render('app');
		} else {
			return res.json({success: false, msg: 'Error while loading page.'});
		}
	});

	return router;
}