'use strict';

var constants = require('../common/constants');

module.exports = function (racesData) {
    return {
        default: function (req, res) {
            var currentUser = req.app.locals.user;
            res.status(200);
            res.render('races', {
                auser: {
                    name: currentUser ? currentUser.username : undefined,
                    authorized: req.app.locals.user
                }
            });
        },
        createRaceRender: function (req, res) {
            var currentUser = req.app.locals.user;

            if (!currentUser) {
                res.redirect('/api/users/login');
            }

            var mapsData = require('../data/data-maps');
            mapsData.getAllAsJson()
                .then(function (responseMaps) {
                    res.status(200);
                    res.render('races-add', {
                        maps: responseMaps,
                        cars: currentUser.cars
                    })
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });

        },
        listAllRender: function (req, res) {
            var racesFromDb = racesData
                .all(req.query)
                .then(function (responseRaces) {
                    res.status(200);
                    res.render('races-all',
                        {
                            races: responseRaces
                        });
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        createRaceAction: function (req, res) {
            var currentUser = req.app.locals.user;
            if (!currentUser) {
                res.status(400)
                    .json('You are not authorized');
            }
            if (!req.body) {
                res.status(400)
                    .json('Please provide a good data!');
            }

            var users = [];
            users.push(currentUser.username);

            var raceToBeAdded = {
                dateCreated: Date.now(),
                users: users,
                status: 'Waiting for opponents',
                map: 'Donno'
            };

            var result = racesData.save(raceToBeAdded);
            res.status(200);
            res.json(result);
        }
    };
};