'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    SHA256 = require('crypto-js/sha256'),
    notifier = require('node-notifier'),
    path = require('path'),
    constants = require('../common/constants');

var notifyConfig = {
    'title': 'Error',
    icon:  path.join(__dirname, '../../imgs/', 'notification_error.png'),
    time: 2000
};

module.exports = function (data) {
    return {
        //POST
        register: function (req, res) {
            var user = req.body;

            if (!req.body) {
                notifyConfig.message = 'Data was not provided!';
                notifier.notify(notifyConfig);
                return res.status(400)
                    .redirect(req.get('referer'));
            }

            if (!(user.username) || !(user.password)) {
                notifyConfig.message = 'Username and password are required!';
                notifier.notify(notifyConfig);
                return res.status(400)
                    .redirect(req.get('referer'));
            }

            user.hashPassword = SHA256(user.password) + '';
            user.role = constants.roles.regular;
            user.cars = [];
            user.money = constants.models.user.defaultMoney;
            user.dateRegistered = new Date();
            user.level = constants.models.user.defaultLevel;
            user.respect = constants.models.user.defaultRespect;

            data.save(user)
                .then(function (readyUser) {
                    notifyConfig.title = 'Success';
                    notifyConfig.icon = path.join(__dirname, '../../imgs/', 'notification_success.png');
                    notifyConfig.message = 'Success now you must login';
                    notifier.notify(notifyConfig);
                res.status(201)
                    .redirect('/home');
            }, function (error) {
                    notifyConfig.message = error.message;
                    notifier.notify(notifyConfig);
                res.status(error.status || 400)
                    .redirect(req.get('referer'));
            });
        },
        login: function (req, res) {
            // Code duplicate !!
            var user = req.body;
            if (!req.body) {
                notifyConfig.message = 'data was not provided!';
                notifier.notify(notifyConfig);
                res.status(400)
                    .redirect(req.get('referer'));
                return;
            }

            if (!(user.username) || !(user.password)) {
                notifyConfig.message = 'Username and password are required!';
                notifier.notify(notifyConfig);
                res.status(400)
                    .redirect(req.get('referer'));
                return;
            }

            //  http://expressjs.com/en/api.html#res.cookie
            data.login(user)
                .then(function (user) {

                    var date = new Date();
                    date.setHours(date.getHours() + constants.cookieHours);

                    notifyConfig.title = 'Success';
                    notifyConfig.icon = path.join(__dirname, '../../imgs/', 'notification_success.png');
                    notifyConfig.message = 'Welcome ' + user.username;
                    notifier.notify(notifyConfig);

                    res.cookie('Authorization', 'Bearer ' + user.token, {expires: date});
                    res.redirect('/home');
                }, function (error) {

                    notifyConfig.title = 'Success';
                    notifyConfig.message = error.message;
                    notifier.notify(notifyConfig);
                    res.status(error.status || 400)
                        .redirect(req.get('referer'));
                });
        },
        logout: function (req, res) {
            req.logout();

            notifyConfig.icon = path.join(__dirname, '../../imgs/', 'notification_success.png');
            notifyConfig.message = 'Success logout!';
            notifier.notify(notifyConfig);

            res.clearCookie('Authorization');
            res.redirect('/home');
        },

        //GET
        loginForm: function (req, res) {
            res.status(200);
            res.render('login');
        },

        registerForm: function (req, res) {
            res.status(200);
            res.render('register');
        }
    };
};