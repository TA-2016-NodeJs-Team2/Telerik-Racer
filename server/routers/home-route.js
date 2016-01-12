var express = require('express'),
    router = express.Router(),
    homeController = require('../controllers/home-controller')(),
    passport = require('passport');

router
    .get('', homeController.getAnswer)
    .get('/home', homeController.getAnswer);
//.post('/delete', passport.authenticate('bearer', {
//    session: false
//}), carsController.removeCar);

module.exports = function (app) {
    app.use('/', router);
};