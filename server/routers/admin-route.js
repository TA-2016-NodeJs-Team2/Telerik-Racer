'use strict';

var express = require('express'),
    router = express.Router(),
    userData = require('../data/data-users'),
    adminController = require('../controllers/admin-controller')(userData),
    passport = require('passport'),
    constants = require('../common/constants');

// middleware
router.use(function (req, res, next) {
    if (req.user.role === constants.roles.administrator) {

        // set header in middleware, then it can be verified in the controller
        req.headers[constants.securityHeader.name] = constants.securityHeader.value;
        return next();
    }

    // TODO: implement some view permissions required
    res.redirect('/login');
});

// middleware to set query params
router.use('/users', function (req, res, next) {

    // check from possible fields for sorting
    var byField = constants.query.users.possibleFields.find(function (elem) {
            return elem === req.query.by;
    });

    req.query.by = byField || constants.query.users.by;
    req.query.by = (req.query.sort === 'desc' ? '-' : '') + req.query.by;
    req.query.page = req.query.page || constants.query.defaultPage;

    req.query.size = constants.query.defaultSize;
    next();
});

router
    .get('/', function (req, res) {
        // should render some view

        // get header that was set in middleware
        if (req.headers[constants.securityHeader.name] !== constants.securityHeader.value) {
            res.redirect('/login');
            return;
        }

        console.log(req.headers);
        res.send('Administrator view');
    })
    .get('/users', adminController.all)
    .get('/users/:id', adminController.details)
    .delete('/users/:id', adminController.deleteUser)
    .put('/users/:id', adminController.updateUser);

module.exports = function (app) {
    app.use('/api/admin/', passport.authenticate('bearer', {
        failureRedirect: '/home',
        session: false
    }), router);
};

