'use strict';

// configuration about passport authentication
let passport = require('passport'),
    BearerStrategy = require('passport-http-bearer'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CookieStrategy = require('./passport-cookie');

// define a new strategy for authentication.
passport.use(new CookieStrategy(function (token, done) {
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
