'use strict';

var express = require('express'),
    router = new express.Router(),
    passport = require('passport'),
    usersData = require('../data/data-users'),
    profileController = require('../controllers/profile-controller')(usersData);

router
    .get('/', profileController.userInfo)
    .get('/cars', profileController.listCars)
    .post('/cars/repair', profileController.repair);

module.exports = function (app) {
    app.use('/profile', passport.authenticate('cookie', {
        failureRedirect: '/unauthorised',
        session: false
    }), router);
};