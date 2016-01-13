var express = require('express'),
    router = express.Router(),
    carsData = require('../data/data-cars'),
    carsController = require('../controllers/cars-controller')(carsData),
    passport = require('passport');

// TODO: Add more routes.
router
    .get('/all', carsController.getAllCars)
    .get('/:id', passport.authenticate('cookie', {
        failureRedirect: '/unauthorised',
        session: false
    }), carsController.getCarById)
    .post('/:id/buy', passport.authenticate('cookie', {
        failureRedirect: '/unauthorised',
        session: false
    }), carsController.buyCar)
    .post('/delete', passport.authenticate('cookie', {
        failureRedirect: '/unauthorised',
        session: false
    }), carsController.removeCar)
    .get('/*', function (req, res) {
        res.redirect('/shop/cars/all');
    });

module.exports = function (app) {
    app.use('/shop/cars', router);
};