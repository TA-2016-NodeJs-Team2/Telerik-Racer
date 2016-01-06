'use strict';

var express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/users-controller');

router
    .post('/login', usersController.login)
    .post('/register', usersController.register);

module.exports = function (app) {
    app.use('/api/users', router);
};