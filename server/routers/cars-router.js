var express = require('express'),
    router = express.Router(),
    carsData = require('../data/data-cars'),
    carsController = require('../controllers/cars-controller')(carsData),
    passport = require('passport');

// TODO: Add more routes.
router
    .get('/{id}', carsController.getCarById)
    .post('/delete', passport.authenticate('cookie', {
        session: false
    }), carsController.removeCar);

module.exports = function (app) {
    app.use('/api/cars', router);
};