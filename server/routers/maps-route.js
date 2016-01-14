'use strict';

var express = require('express'),
    router = new express.Router(),
    passport = require('passport'),
    mapsData = require('../data/data-maps'),
    notifier = require('node-notifier'),
    mapsController = require('../controllers/maps-controller')(mapsData, notifier),
    constants = require('../common/constants');

router.use(function (req, res, next) {
    if (req.user.role === constants.roles.administrator || req.user.role === constants.roles.moderator) {
        return next();
    }

    // TODO: implement some route
    res.redirect('/home');
});

router.use(function (req, res, next) {

    var byField = constants.query.maps.possibleFields.find(function (elem) {
        return elem === req.query.by;
    });

    req.query.by = byField || constants.query.maps.by;
    req.query.by = (req.query.sort === 'desc' ? '-' : '') + req.query.by;
    req.query.page = req.query.page || constants.query.defaultPage;

    req.query.size = constants.query.defaultSize;
    next();
});

router.get('/all', mapsController.getAll)
    .get('/add', mapsController.addForm)
    .get('/:id', mapsController.getDetails)
    .post('/:id/remove', function (req, res, next) {
        if (req.user.role === constants.roles.administrator) {
        	return next();
        }

        // Page that says: permissions required;
        res.redirect('/unauthorised');
    }, mapsController.delete)
    .post('/add', mapsController.add)
    .get('/*', function (req, res) {
        res.redirect('/maps/all');
    });

module.exports = function (app) {
    app.use('/maps', passport.authenticate('cookie', {
        failureRedirect: '/unauthorised',
        session: false
    }), router);
};