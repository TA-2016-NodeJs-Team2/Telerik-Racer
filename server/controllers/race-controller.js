'use strict';

var constants = require('../common/constants'),
    moment = require('moment');

function DamageCar(carToDamage, damageToMake) {
    carToDamage.damage += damageToMake;
    if (carToDamage.damage > 100) {
        carToDamage.damage = 100;
    }
    return carToDamage;
};

function GetWinners(carsToCompare, winnersToGet) {
    var winners = [];
    var middlewareValues = [];

    for (var i = 0; i < carsToCompare.length; i++) {
        var car = carsToCompare[i];
        var number = car.turbo * 2 + car.engineLevel * 10 + car.wheelsLevel * 7 - car.damage / 10;
        middlewareValues.push(number);
    }

    for (var i = 0; i < winnersToGet; i++) {
        var biggest = middlewareValues[0];
        var indexToStore = 0;

        for (var j = 1; j < middlewareValues.length; j++) {
            if (biggest < middlewareValues[j]) {
                biggest = middlewareValues[j];
                indexToStore = j;
            }
        }
        winners.push(indexToStore);
        middlewareValues[indexToStore] = 0;
        indexToStore = 0;
    }

    return winners;
}

module.exports = function (racesData, carsData, mapsData, usersData) {
    return {
        default: function (req, res) {
            var currentUser = req.app.locals.user;
            res.status(200);
            res.render('race-views/races', {
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
                    res.render('race-views/races-add', {
                        maps: responseMaps,
                        cars: currentUser.cars
                    });
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });

        },
        listAllRender: function (req, res) {
            var racesFromDb = racesData
                .all(req.query.page, req.query.size, req.query.sort, req.query.only)
                .then(function (responseRaces) {
                    var page = (req.query.page * 1) || 1;
                    var pageSize = (req.query.size * 1) || 10;
                    res.status(200);
                    res.render('race-views/races-all',
                        {
                            races: responseRaces,
                            sort: req.query.sort,
                            only: req.query.only,
                            pageSize: pageSize,
                            nextPage: function () {
                                return page + 1;
                            },
                            prevPage: function () {
                                return page - 1;
                            }
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

            var usersIds = [];
            usersIds.push(currentUser._id);

            var cars = [];
            cars.push(req.body.car);

            var mapParts = req.body.map.split('|');

            var raceToBeAdded = {
                dateCreated: Date.now(),
                users: users,
                cars: cars,
                status: 'Waiting for opponents',
                map: mapParts[1],
                creator: currentUser.username,
                mapId: mapParts[0],
                usersIds: usersIds
            };

            racesData.save(raceToBeAdded).then(function (savedRace) {
                res.status(201);
                res.redirect('/races/' + savedRace._id);
            }, function (err) {
                res.status(400)
                    .redirect(req.get('referer'));
            });
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
                    for (var user of
                        responseRace.users
                        ) {
                        if (user === currentUser.username) {
                            canJoin = false;
                        }
                    }

                    res.render('race-views/races-detailed',
                        {
                            cars: currentUser.cars,
                            id: req.params.id,
                            configuration: {
                                canStart: canStart,
                                canJoin: canJoin
                            },
                            race: responseRace,
                            date: moment(responseRace.dateCreated).format(' Do MMMM YYYY, h:mm:ss a')
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

                    for (var user of
                        responseRace.users
                        ) {
                        if (user === currentUser.username) {
                            canJoin = false;
                        }
                    }
                    if (!canJoin) {
                        res.status(400);
                        res.json("You can't join race more than once!");
                        return;
                    }

                    if (!req.body.car) {
                        res.status(400);
                        res.json("You haven't specified your car!");
                        return;
                    }
                    responseRace.cars.push(req.body.car);
                    responseRace.users.push(currentUser.username);
                    responseRace.usersIds.push(currentUser._id);
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
        },
        startRace: function (req, res) {
            var currentUser = req.app.locals.user;
            if (!currentUser) {
                res.status(400)
                    .json('You are not authorized');
                return;
            }
            var raceFromDb = racesData
                .details(req.params.id)
                .then(function (responseRace) {
                    var canStart = false;
                    if (responseRace.creator === currentUser.username) {
                        canStart = true;
                    }

                    if (!canStart) {
                        res.status(400);
                        res.json("You can't start someone's race");
                        return;
                    }

                    var countOfCompetitors = responseRace.users.length;

                    if (countOfCompetitors <= 1) {
                        res.status(400);
                        res.json("There are not enough racers to compete!");
                        return;
                    }

                    var carsFromDb = [];
                    var usersFromDb = [];
                    mapsData.details(responseRace.mapId).then(function (responseMap) {
                        for (var i = 0; i < responseRace.cars.length; i++) {
                            carsData.details(responseRace.cars[i])
                                .then(function (responseCar) {
                                    var pusshedCar = DamageCar(responseCar, responseMap.damageToTake);
                                    carsFromDb.push(pusshedCar);

                                    for (var x = 0; x < countOfCompetitors; x++) {
                                        usersData.details(responseRace.usersIds[x])
                                            .then(function (responseUser) {
                                                usersFromDb.push(responseUser);

                                                if (carsFromDb.length == countOfCompetitors && usersFromDb.length == countOfCompetitors) {

                                                    res.status(200);
                                                    var winnersToGet = 0;
                                                    if (countOfCompetitors < responseMap.prizes.length) {
                                                        winnersToGet = countOfCompetitors;
                                                    } else {
                                                        winnersToGet = responseMap.prizes.length;
                                                    }
                                                    var winnersIndexes = GetWinners(carsFromDb, winnersToGet);

                                                    for (var j = 0; j < winnersIndexes.length; j++) {
                                                        usersFromDb[winnersIndexes[j]].money += responseMap.prizes[j];
                                                        usersFromDb[winnersIndexes[j]].respect += responseMap.respectGiven[j];
                                                        usersFromDb[winnersIndexes[j]].save();
                                                    }

                                                    for (var y = 0; y < countOfCompetitors; y++) {
                                                        carsFromDb[y].save();
                                                    }
                                                    console.log(carsFromDb);
                                                    res.status(200);
                                                    res.json("Brao! Pobeditel e: " + usersFromDb[winnersIndexes[0]].username);
                                                }
                                            });
                                    }
                                });
                        }
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