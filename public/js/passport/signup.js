var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('signup', new LocalStrategy({passReqToCallback: true},
        function(req, username, password, done) {
            console.log(req);
            registerUser = function() {
                User.findOne({"username": username}, function(err, user) {
                    //If Unexpected Error - Log It & Return It
                    if (err) {
                        console.log("Registration Error: " + err);
                        return done(err, null); //Return err, no user
                    }

                    //If User Already Exists
                    if (user) {
                        console.log("Username '" + username + "' already exists.'");
                        return done(null, false, req.flash('message', 'User Already Exists.'));
                    } else {
                        //Declare & Instantiate Empty User Object
                        var newUser = new User();

                        //Set Credentials
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.database = req.param('database');
                        newUser.role = req.param('role');
                        newUser.collections = createArray(req.param('collections'));

                        //Save New User To database
                        newUser.save(function(err) {
                            if (err) {
                                console.error("Error Saving User: " + err);
                                throw err;
                            }
                            console.log("User Registration Successful.");
                            return done(null, newUser);
                        });
                    }
                }); //End of User.findOne()
            } //End of registerUser's anon function
            //Delay Invocation of registerUser() until the next event loop tick
            process.nextTick(registerUser);
        }) //End of passport.use() anon function
    ); //End of passport.use()

    //Function For Encrypting Passwords
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
} //End of exported function

function createArray(collections) {
    var sel = collections.replace(/\s/g, '');
    sel = collections.split(",")
    return sel;
}