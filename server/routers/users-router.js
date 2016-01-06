'use strict';

var express = require('express'),
    router = express.Router(),
    usersController = require('../controllers/users-controller'),
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