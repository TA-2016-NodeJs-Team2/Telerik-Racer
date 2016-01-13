'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    SHA256 = require('crypto-js/sha256'),
    notifier = require('node-notifier'),
    path = require('path'),
    constants = require('../common/constants');

var notifyError = {
    'title': 'Error',
    icon: path.join(__dirname, '../../imgs/', 'notification_error.png'),
    time: 2000
};

var notifySuccess = {
    'title': 'Success',
    icon: path.join(__dirname, '../../imgs/', 'notification_success.png'),
    time: 2000
};

module.exports = function (data) {
    return {
        //POST
        register: function (req, res) {
            var user = req.body;

            if (!req.body) {
                notifyError.message = 'Data was not provided!';
                notifier.notify(notifyError);
                return res.status(400)
                    .redirect(req.get('referer'));
            }

            if (!(user.username) || !(user.password)) {
                notifyError.message = 'Username and password are required!';
                notifier.notify(notifyError);
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
                    notifySuccess.message = 'Success now you must login';
                    notifier.notify(notifySuccess);
                    res.status(201)
                        .redirect('/home');
                }, function (error) {
                    notifyError.message = error.message;
                    notifier.notify(notifyError);
                    res.status(error.status || 400)
                        .redirect(req.get('referer'));
                });
        },
        login: function (req, res) {
            // Code duplicate !!
            var user = req.body;
            if (!req.body) {
                notifyError.message = 'data was not provided!';
                notifier.notify(notifyError);
                res.status(400)
                    .redirect(req.get('referer'));
                return;
            }

            if (!(user.username) || !(user.password)) {
                notifyError.message = 'Username and password are required!';
                notifier.notify(notifyError);
                res.status(400)
                    .redirect(req.get('referer'));
                return;
            }

            //  http://expressjs.com/en/api.html#res.cookie
            data.login(user)
                .then(function (user) {

                    var date = new Date();
                    date.setHours(date.getHours() + constants.cookieHours);

                    notifySuccess.message = 'Welcome ' + user.username;
                    notifier.notify(notifySuccess);

                    res.cookie('Authorization', 'Bearer ' + user.token, {expires: date});
                    res.redirect('/home');
                }, function (error) {

                    notifyError.message = error.message;
                    notifier.notify(notifyError);
                    res.status(error.status || 400)
                        .redirect(req.get('referer'));
                });
        },
        logout: function (req, res) {
            req.logout();
            notifySuccess.message = 'Success logout!';
            notifier.notify(notifySuccess);

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