var login = require('./login');
var signup = require('./signup');
var User = require('../../../models/user');

module.exports = function(passport){
	//Serialise User
    passport.serializeUser(function(user, done) {
        console.log("Serializing User: " + user.username + "\n" + user + ".");
        done(null, user._id);
    });

    //De-Serialise User
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log("Deserializing User: " + user.username + "\n" + user);
            done(err, user);
        });
    });

    //Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
}
