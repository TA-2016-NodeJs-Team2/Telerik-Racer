"use strict";
var constants = require('../common/constants'),
    notifier = require('node-notifier'),
    path = require('path');

var errorConfig = {
    title: 'Error',
    icon: path.join(__dirname, '../../imgs/', 'notification_error.png'),
    time: 2000
};

var successConfig = {
    title: 'Success',
    icon: path.join(__dirname, '../../imgs/', 'notification_success.png'),
    time: 2000
};

var defaultRedirect = '/api/admin/users';

module.exports = function (data) {
    return {
        all: function (req, res) {
            data.all(req.query)
                .then(function (response) {
                    res.render('admin-views/users', {users: response});
                }, function (err) {
                    errorConfig.message = err.message;
                    notifier.notify(errorConfig);
                    res.status(400)
                        .redirect(defaultRedirect);
                });
        },
        details: function (req, res) {
            if (!constants.objectIdPattern.test(req.params.id)) {
                errorConfig.message = 'This is not an Id';
                notifier.notify(errorConfig);
                return res.status(400)
                    .redirect(defaultRedirect);
            }
            data.details(req.params.id)
                .then(function (user) {
                    res.render('admin-views/user-details', {info: user});
                }, function (err) {
                    errorConfig.message = err.message;
                    notifier.notify(errorConfig);
                    res.status(400)
                        .redirect(defaultRedirect);
                });
        },
        deleteUser: function (req, res) {
            if (!constants.objectIdPattern.test(req.params.id)) {
                errorConfig.message ='This is not an Id';
                notifier.notify(errorConfig);
                return res.status(400)
                    .redirect(defaultRedirect);
            }

            if (!(req.params.id)) {
                errorConfig.message ='Id not provided';
                notifier.notify(errorConfig);
                return res.status(400)
                    .redirect(defaultRedirect);
            }

            // authenticated User
            var user = req.user;

            data.remove(req.params.id)
                .then(function (data) {
                    successConfig.message = data.message;
                    notifier.notify(successConfig);
                    res.redirect(defaultRedirect);
                }, function (err) {
                    errorConfig.message = err.message;
                    notifier.notify(errorConfig);
                    res.status(400)
                        .redirect(req.get('referer'));
                });
        },
        updateUser: function (req, res) {
            if (!(req.body)) {
                errorConfig.message = 'you should provide a model to update!';
                notifier.notify(errorConfig);
                return res.status(400)
                    .redirect(req.get('referer'));
            }

            data.update(req.params.id, req.body)
                .then(function (user) {
                    successConfig.message = 'User updated!';
                    notifier.notify(successConfig);
                    res.redirect(req.get('referer'));
                }, function (error) {
                    errorConfig.message = error.message;
                    notifier.notify(errorConfig);
                    return res.status(400)
                        .redirect(req.get('referer'));
                });
        }
    };
};