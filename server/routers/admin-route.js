'use strict';

var express = require('express'),
    router = express.Router(),
    userData = require('../data/data-users'),
    adminController = require('../controllers/admin-controller')(userData),
    passport = require('passport');

// middleware
router.use(function (req, res, next) {
    // TODO: Global constant for roles
    if (req.user.role === 'administrator') {

        // set header in middleware
        req.headers['X-AdminAuth'] = 'whatEver';
        next();
        return;
    }

    // TODO: implement some route
    res.redirect('/login');
});

// middleware to set query params
router.use('/users', function (req, res, next) {
    // Global Constants
    // TODO: validate sort to be one of the possible fields
    req.query.by = req.query.by || 'username';
    req.query.by = (req.query.sort === 'desc' ? '-' : '') + req.query.by;
    req.query.page = req.query.page || 1;

    req.query.size = 10;
    next();
});

router
    .get('/', function (req, res) {
        // should render some view

        // get header that was set in middleware
        if (!(req.headers['X-AdminAuth'])) {
            res.redirect('/login');
            return;
        }

        console.log(req.headers);
        res.send('Administrator view');
    })
    .get('/users', adminController.all)
    .get('/users/:id', adminController.details)
    .delete('/users/:id', adminController.deleteUser);

module.exports = function (app) {
    app.use('/api/admin/', passport.authenticate('bearer', {
        session: false
    }), router);
};

