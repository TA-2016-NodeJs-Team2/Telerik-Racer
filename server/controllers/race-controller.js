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
                return;
            }
            if (!req.body) {
                res.status(400)
                    .json('Please provide a good data!');
                return;
            }

            if (!req.body.car || !req.body.map) {
                res.status(400)
                    .json('Please enter the data in the form!');
                return;
            }

            var users = [];
            users.push(currentUser.username);

            var cars = [];
            cars.push(req.body.car);

            var raceToBeAdded = {
                dateCreated: Date.now(),
                users: users,
                status: 'Waiting for opponents',
                map: req.body.map,
                creator: currentUser.username
            };

            var result = racesData.save(raceToBeAdded);
            res.status(200);
            res.json(result);
        },
        specificRender: function (req, res) {
            var currentUser = req.app.locals.user;
            if (!currentUser) {
                res.status(400)
                    .json('You are not authorized');
                return;
            }
            var raceFromDb = racesData
                .details(req.params.id)
                .then(function (responseRace) {
                    res.status(200);
                    var canJoin = true;
                    var canStart = false;
                    if (responseRace.creator === currentUser.username) {
                        canStart = true;
                    }
                    for (var user of responseRace.users)
                    {
                        if (user === currentUser.username) {
                            canJoin = false;
                        }
                    }

                    res.render('races-detailed',
                        {
                            cars: currentUser.cars,
                            id: req.params.id,
                            configuration: {
                                canStart: canStart,
                                canJoin: canJoin
                            },
                            race: responseRace
                        });
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        joinRace: function (req, res) {
            var currentUser = req.app.locals.user;
            if (!currentUser) {
                res.status(400)
                    .json('You are not authorized');
                return;
            }
            var raceFromDb = racesData
                .details(req.params.id)
                .then(function (responseRace) {
                    var canJoin = true;

                    for (var user of responseRace.users)
                    {
                        if (user === currentUser.username) {
                            canJoin = false;
                        }
                    }
                    if (!canJoin) {
                        res.status(400);
                        res.json("You can't join race more than once!");
                    }

                    responseRace.users.push(currentUser.username);
                    var result = responseRace.save(function (err, race) {
                        if (err) {
                            res.status(500);
                            res.json(err);
                            return;
                        }
                        res.redirect(req.params.id);
                    });
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        }
    };
};