'use strict';

module.exports = function (maps) {
    return {
        getAll: function (req, res) {
            maps.all(req.query)
                .then(function (responseMaps) {
                    res.json(responseMaps);
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        getDetails: function (req, res) {
            //Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
            if (req.params.id.length !== 24) {
                res.status(400)
                    .json({
                        message: 'This is not an Id'
                    });
                return;
            }

            maps.details(req.params.id)
                .then(function (responseMap) {
                    res.json(responseMap);
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

            // TODO: Constants
            var minLength = 5;

            // TODO: and sort them, or check to be sorted
            for (var i = 1; i <= minLength; i += 1) {
                var price = req.body['prize' + i];
                var respect = req.body['respect' + i];
                if (price && !isNaN(price)) {
                    car.prizes.push(price);
                }

                if (respect && !isNaN(respect)) {
                    car.respectGiven.push(respect);
                }
            }

            if (car.prizes.length !== minLength ||
                car.respectGiven.length !== minLength) {
                res.status(400)
                    .json("Prizes and respects should be " + minLength);
                return;
            }

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