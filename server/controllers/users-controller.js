'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    SHA256 = require('crypto-js/sha256'),
    constants = require('../common/constants');

module.exports = function (data) {
    return {
        //POST
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
            user.role = constants.roles.regular;
            user.cars = [];
            user.money = constants.models.user.defaultMoney;
            user.dateRegistered = new Date();
            user.level = constants.models.user.defaultLevel;
            user.respect = constants.models.user.defaultRespect;

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
                    date.setHours(date.getHours() + constants.cookieHours);

                    res.cookie('Authorization', 'Bearer ' + user.token, {expires: date});
                    res.send(user);
                }, function (error) {
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
        logout: function (req, res) {
            req.logout();
            res.clearCookie('Authorization');
            res.send('cookie should be cleared!');
        },

        //GET
        loginForm: function (req, res) {
            res.status(200);
            res.send('This is a login form');
        },

        registerForm: function (req, res) {
            res.status(200);
            res.render('register');
        }
    };
};