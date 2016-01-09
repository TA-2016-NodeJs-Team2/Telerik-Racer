'use strict';

var express = require('express'),
    router = new express.Router(),
    passport = require('passport'),
    mapsData = require('../data/data-maps'),
    mapsController = require('../controllers/maps-controller')(mapsData);

router.use(function (req, res, next) {
    // TODO: Global constant for roles
    if (req.user.role === 'administrator' || req.user.role === 'moderator') {
        next();
        return;
    }

    // TODO: implement some route
    res.redirect('/home');
});

router.use(function (req, res, next) {
    // Global Constants
    // TODO: validate sort to be one of the possible fields
    req.query.by = req.query.by || 'name';
    req.query.by = (req.query.sort === 'desc' ? '-' : '') + req.query.by;
    req.query.page = req.query.page || 1;

    req.query.size = 10;
    next();
});

router.get('/all', mapsController.getAll)
    .get('/add', mapsController.addForm)
    .get('/:id', mapsController.getDetails)
    .delete('/:id/remove', mapsController.delete)
    .post('/add', mapsController.add)
    .get('/*', function (req, res) {
        res.redirect('/maps/all');
    });

module.exports = function (app) {
    app.use('/maps', passport.authenticate('bearer', {
        session: false
    }), router);
};