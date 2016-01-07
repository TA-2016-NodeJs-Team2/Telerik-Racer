'use strict';

var express = require('express'),
    router = express.Router(),
    usersData = require('../data/data-users'),
    usersController = require('../controllers/users-controller')(usersData),
    passport = require('passport');

router
    .post('/login', usersController.login)
    .post('/register', usersController.register)
    .post('/delete', passport.authenticate('bearer', {
        session: false
    }), usersController.deleteUser);

module.exports = function (app) {
    app.use('/api/users', router);
};