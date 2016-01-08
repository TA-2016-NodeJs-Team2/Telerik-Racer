'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    SHA256 = require('crypto-js/sha256'),
    dateExt = require('../common/date-time-extensions');

module.exports = function (data) {
    return {
        register: function (req, res) {
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
            user.role = User.getRoles()[0]; // regular TODO: some global constants
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
                res.status(error.status || 400)
                    .json({
                        message: error.message
                    });
            });
        },
        login: function (req, res) {
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

            //  http://expressjs.com/en/api.html#res.cookie
            data.login(user)
                .then(function (user) {

                    var date = new Date();
                    date.setHours(date.getHours() + 24);

                    res.cookie('Authentication', 'Bearer ' + user.token, {expires: date});
                    res.send(user);
                }, function (error) {
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
        logout: function (req, res) {
            req.logout();
            res.clearCookie('Authentication');
            res.send('');
        }
    };
};