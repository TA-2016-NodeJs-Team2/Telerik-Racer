'use strict';

var express = require('express'),
    router = express.Router(),
    usersData = require('../data/data-users'),
    usersController = require('../controllers/users-controller')(usersData);

router
    .post('/login', usersController.login)
    .post('/register', usersController.register)
    .post('/logout', usersController.logout);

module.exports = function (app) {
    app.use('/api/users', router);
};