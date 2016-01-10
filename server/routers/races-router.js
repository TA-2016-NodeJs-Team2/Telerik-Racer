'use strict';

var express = require('express'),
    router = new express.Router(),
    passport = require('passport'),
    racesData = require('../data/data-races'),
    racesController = require('../controllers/race-controller')(racesData),
    constants = require('../common/constants');


router
    .get('/all', racesController.getAll);

module.exports = function (app) {
    app.use('/races', passport.authenticate('bearer', {
        failureRedirect: '/home',
        session: false
    }), router);
};