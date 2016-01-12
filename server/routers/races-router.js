'use strict';

var express = require('express'),
    router = new express.Router(),
    racesData = require('../data/data-races'),
    carsData = require('../data/data-cars'),
    mapsData = require('../data/data-maps'),
    usersData = require('../data/data-users'),
    racesController = require('../controllers/race-controller')(racesData, carsData, mapsData, usersData);


router
    .get('/', racesController.default)
    .get('/add', racesController.createRaceRender)
    .post('/add', racesController.createRaceAction)
    .get('/all', racesController.listAllRender)
    .get('/:id', racesController.specificRender)
    .post('/:id/start', racesController.startRace)
    .post('/:id', racesController.joinRace);


module.exports = function (app) {
    app.use('/races', router);
};