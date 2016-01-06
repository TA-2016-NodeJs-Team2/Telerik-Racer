'use strict';

// configuration about passport authentication
let passport = require('passport'),
    Strategy = require('passport-http-bearer'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

// define a new strategy for authentication.
passport.use(new Strategy(function (token, done) {
    User.findOne({
        token: token
    }, function (err, user) {
        if (err) {
            done(err);
            return;
        }

        done(null, user);
    });
}));
