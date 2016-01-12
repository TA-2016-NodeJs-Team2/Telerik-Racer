'use strict';

var express = require('express'),
    router = new express.Router(),
    racesData = require('../data/data-races'),
    racesController = require('../controllers/race-controller')(racesData);


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