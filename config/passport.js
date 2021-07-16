const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const {
    Client
} = require('../models/client');
const {
    User
} = require('../models/user');

module.exports = function(passport) {


    passport.use('client', new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {

        console.log("callback fun");

        // Match User
        Client.findOne({
            email: email
        }).then(client => {
            if (!client) {
                return done(null, false, {
                    message: 'المستخدم غير موجود'
                });
            }

            // if (user.request == false) {
            //     return done(null, false, {
            //         message: 'طلب تسجيلك لم تتم الموافقه عليه حاليا يرجى الانتظار'
            //     });
            // }

            bcrypt.compare(password, client.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, client, {
                        message: 'اهلا بعودتك, ' + client.name
                    });
                } else {
                    return done(null, false, {
                        message: 'كلمة مرور غير صالحه '
                    });
                }
            })
        });


        passport.serializeUser(function(client, done) {
            done(null, client.id);
        });

        passport.deserializeUser(function(id, done) {
            Client.findById(id, function(err, client) {
                done(err, client);
            });
        });
    }));






    // //user

    passport.use('user', new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {

        // Match User
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'المستخدم غير موجود'
                });
            }

            if (user.request == false) {
                return done(null, false, {
                    message: 'طلب تسجيلك لم تتم الموافقه عليه حاليا يرجى الانتظار'
                });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    return done(null, user, {
                        message: 'اهلا بعودتك, ' + user.name
                    });
                } else {
                    return done(null, false, {
                        message: 'كلمة مرور غير صالحه '
                    });
                }
            })
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
