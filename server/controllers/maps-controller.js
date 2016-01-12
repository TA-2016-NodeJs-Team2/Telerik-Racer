'use strict';

var constants = require('../common/constants');

module.exports = function (maps) {
    return {
        getAll: function (req, res) {
            maps.all(req.query)
                .then(function (responseMaps) {
                    res.render('maps', {maps: responseMaps});
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        getDetails: function (req, res) {

            // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
            if (!constants.objectIdPattern.test(req.params.id)) {
                res.status(400)
                    .json({
                        message: 'This is not an Id'
                    });
                return;
            }

            maps.details(req.params.id)
                .then(function (responseMap) {
                    res.render('map-detail', {map: responseMap});
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        add: function (req, res) {
            if (!req.body) {
                res.status(400)
                    .json('Please provide a car!');
            }

            var car = req.body;
            car.date = new Date();

            car.prizes = [];
            car.respectGiven = [];

            var minLength = constants.models.minLengthPrizes;

            for (var i = 1; i <= minLength; i += 1) {
                var prize = req.body['prize' + i];
                var respect = req.body['respect' + i];
                if (prize && !isNaN(prize) && (+prize >= 0)) {
                    car.prizes.push(+prize);
                }

                if (respect && !isNaN(respect) && (+respect >= 0)) {
                    car.respectGiven.push(+respect);
                }
            }

            if (car.prizes.length !== minLength ||
                car.respectGiven.length !== minLength) {
                res.status(400)
                    .json('Prizes and respects should be ' + minLength + ' positive numbers!');
                return;
            }

            car.prizes.sort(function (a, b) {
                return a < b;
            });
            car.respectGiven.sort(function (a, b) {
                return a < b;
            });

            maps.save(car)
                .then(function (responseCar) {
                    res.json(responseCar);
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        addForm: function (req, res) {
            res.json('Form for adding a map!');
        },
        delete: function (req, res) {
            maps.remove(req.params.id)
                .then(function (result) {
                    res.json(result);
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        }
    };
};