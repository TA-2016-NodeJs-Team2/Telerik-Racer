'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    SHA256 = require('crypto-js/sha256');

module.exports = function (data) {
    return {
        register: function (req, res, next) {
            var user = req.body;

            if (!req.body) {
                res.status(400)
                    .json({
                        message: 'data was not provided!'
                    });
                return;
            }

            if (!(user.username) || !(user.password)) {
                res.status(400)
                    .json({
                        message: 'Username and password are required!'
                    });
                return;
            }

            user.hashPassword = SHA256(user.password) + '';
            user.role = User.getRoles()[0]; // regular
            user.cars = [];
            user.money = 10000; // TODO: Constants
            user.dateRegistered = new Date();
            user.level = 1;
            user.respect = 0;

            data.save(user).then(function (readyUser) {
                res.status(201)
                    .json({
                        username: readyUser.username
                    });
            }, function (error) {
                res.status(error.status || 500)
                    .json({
                        message: error.message
                    });
            });
            /*dbUser.save(function (err, user) {
                if (err) {
                    res.status(400)
                        .json({
                            message: err.message
                        });
                    return;
                }

                res.status(201)
                    .json({
                        username: user.username
                    });
            });*/
        },
        login: function (req, res, next) {
            // Code duplicate !!
            var user = req.body;

            if (!req.body) {
                res.status(400)
                    .json({
                        message: 'data was not provided!'
                    });
                return;
            }

            if (!(user.username) || !(user.password)) {
                res.status(400)
                    .json({
                        message: 'Username and password are required!'
                    });
                return;
            }

            data.login(user)
                .then(function (user) {
                res.json(user);
            }, function (error) {
                res.status(error.status)
                    .json({message: error.message});
            });

            /*User.findOne({username: user.username})
                .exec(function (err, dbUser) {
                    if (err) {
                        // next(err);
                        res.status(500)
                            .json(err);
                        return;
                    }

                    // user not found
                    if (!dbUser) {
                        res.status(404)
                            .json({
                                message: dbUser.username + ' not found!'
                            });
                        return;
                    }

                    // like SHA256(user.password).toString(); -> https://jsperf.com/tostring-vs-v3/2
                    var hashedPassword = SHA256(user.password) + '';

                    // password mismatch!
                    if (dbUser.hashPassword !== hashedPassword) {
                        res.status(404)
                            .json({
                                message: 'password mismatch'
                            });
                        return;
                    }

                    if (!dbUser.token) {
                        dbUser.token = SHA256(dbUser.username + ' ' + dbUser.password) + '';
                    }

                    // TODO: if lastLogin data is more than 72 hours -> generate a new token

                    dbUser.lastLogin = new Date();
                    dbUser.save();

                    res.json({
                        username: dbUser.username,
                        token: dbUser.token
                    });
                });*/
        },
        deleteUser: function (req, res, next) {
            if (!(req.body) || !(req.body.id)) {
                res.status(400)
                    .json({
                        message: 'you should provide an ID!'
                    });
                return;
            }

            // authenticated User
            var user = req.user;
            var id = req.body.id;

            // User should have role administrator.
            console.log(user.role);
            console.log(User.getRoles()[2]);

            if (user.role !== User.getRoles()[2]) {
                res.status(401)
                    .json({
                        message: 'permissions required!'
                    });
                return;
            }

            data.remove(id)
                .then(function (data) {
                    res.json(data);
                }, function (err) {
                    res.status(err.status)
                        .json({
                            message: err.message
                        });
                });
            /*User.remove({_id: id}, function (err, rawData) {
                if (err) {
                    res.status(400)
                        .json({
                            message: 'wrong id!'
                        });
                    return;
                }

                res.json({
                    status: rawData.result.ok,
                    documentsModified: rawData.result.n,
                    message: rawData.result.n !== 0 ? 'removed!' : 'user not found'
                });
            });*/
        },
        allUsers: function (req, res, next) {

        }
    };
};