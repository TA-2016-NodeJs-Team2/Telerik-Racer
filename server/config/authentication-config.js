'use strict';

// configuration about passport authentication
let passport = require('passport'),
    BearerStrategy = require('passport-http-bearer'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    CookieStrategy = require('./passport-cookie');

module.exports = function (app) {

    app.use(function (req, res, next) {
        if (req.cookies['Authorization']) {
            var parts = req.cookies['Authorization'].split(' ');
            if (parts.length === 2) {
                var scheme = parts[0],
                    credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    User.findOne({token: credentials})
                        .exec(function (err, user) {
                            if (user) {
                                req.app.locals.user = user;
                                return next();
                            } else {
                                req.app.locals.user = undefined;
                                return next();
                            }
                        });
                } else {
                    req.app.locals.user = undefined;
                    return next();
                }
            } else {
                req.app.locals.user = undefined;
                return next();
            }
        } else {
            req.app.locals.user = undefined;
            return next();
        }
    });

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

};
