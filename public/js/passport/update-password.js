var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use(new LocalStrategy({passReqToCallback: true},
        function(req, username, password, done) {
            changePassword = function() {
                User.findOne({"username": username}, function(err, user) {
                    //If Unexpected Error - Log It & Return It
                    if (err) {
                        console.log("Error: " + err);
                        return done(err, null); //Return err, no user
                    }

                   if(user.password == currentPassword) {
                        if (newPassword == newPasswordAgain) {
                            User.update(
                                {username: username},
                                {$set: {password: createHash(newPassword)}},
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
                }); //End of User.findOne()
            } //End of registerUser's anon function
            //Delay Invocation of registerUser() until the next event loop tick
            process.nextTick(changePassword);
        }) //End of passport.use() anon function
    ); //End of passport.use()

    //Function For Encrypting Passwords
    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
} //End of exported function

function validatePasswordForm() {
    var password = $("#newPassword").val();
    var newPasswordAgain = $("newPasswordAgain").val();

    if (newPassword != newPasswordAgain) {
        $("#valid-pass-icon").css({
          "visibility": "visible"
        });
    }
}

var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
