var express = require('express'),
    router = express.Router(),
    carsData = require('../data/data-cars'),
    carsController = require('../controllers/cars-controller')(carsData),
    passport = require('passport');

// TODO: Add more routes.
router
    .get('/all', carsController.getAllCars)
    .get('/:id', carsController.getCarById)
    .post('/:id/buy', passport.authenticate('bearer', {
        session: false
    }), carsController.buyCar)
    .post('/delete', passport.authenticate('bearer', {
        session: false
    }), carsController.removeCar)
    .get('/*', function (req, res) {
        res.redirect('/shop/cars/all');
    });

module.exports = function (app) {
    app.use('/shop/cars',passport.authenticate('cookie', {
        //ТODO: Unauthorised?
        failureRedirect: '/home',
        session: false
    }),  router);
};