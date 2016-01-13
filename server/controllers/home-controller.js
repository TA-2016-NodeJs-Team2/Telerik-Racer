'use strict';

var mongoose = require('mongoose'),
    Car = mongoose.model('Car'),
    User = mongoose.model('User'),
    Race = mongoose.model('Race'),
    constants = require('../common/constants');

module.exports = function () {
    return {
        getAnswer: function (req, res) {
            var currentUser = req.app.locals.user;

            Car.count().exec(function (err, carCount) {
                if (err) throw err;

                User.count().exec(function (err, userCount) {
                    if (err) throw err;

                    Race.count().exec(function (err, raceCount) {
                        if (err) throw err;

                        var auser = {
                            name: currentUser ? currentUser.username : undefined,
                            authorized: req.app.locals.user
                        };
                        if (currentUser) {
                            auser.role = currentUser.role;
                        }

                        res.status(200);
                        res.render('home',
                            {
                                message: "Some ninja statistics",
                                auser: auser,
                                carsStats: carCount,
                                userStats: userCount,
                                raceStats: raceCount,
                                welcomeMessage: "Hello and welcome to the best race game of the year!",
                                notSoImportant: "Judged by ourselves!"
                            }
                        );
                    })
                })
            });
        },
        unauthorised: function(req,res,next) {
            res.status(401);
            res.render('unauthorised',
                {
                    imgUrl: 'http://s3.amazonaws.com/einstein-blog-live/public/uploads/images/44725/crash_photo.jpg',
                    message: "Ooops, you have took a wrong turn! Please log in, because you are not authorised to view this page!"
                }
            );
        }
    };
};