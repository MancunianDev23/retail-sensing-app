var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({passReqToCallback: true},
        function(req, username, password, done) {
            //Queries MongoDB For User
            User.findOne({'username':  username}, function(err, user) {
                //In The Event Of An Error, Throw It
                if (err) {
                    return done(err);
				}

                //Username Does Not Exist, Log Error, Callback, Flash Error Message
                if (!user){
                    console.log('User: '+ username + ", does not exist.");
                    return done(null, false, req.flash('message', 'User Not found.'));
                }

                //User Exists, But Password Is Incorrect
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                }

                //If No Previous Error Conditions Are Met - Username/Password Are Correct
				console.log("Validated User: " + username + ".");

                //Update Last Logged In
                var ip = req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         req.socket.remoteAddress ||
                         req.connection.socket.remoteAddress;
                User.update(
                    {username: username},
                    {$set: {lastLogin: Date.now(), lastIp: ip, loggedIn: true}},
                    {multi: false},
                    function(err, numberAffected) {
                        if (err) throw err;
                        console.log(req.user.username + " logged in at " + Date.now());
                    }
                );

                //Return User Object
				return done(null, user);
            }); //End of User.findOne()
        }) //End of new LocalStrategy
	); //End of passport.use()

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}
