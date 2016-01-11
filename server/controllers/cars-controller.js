'use strict';

var mongoose = require('mongoose'),
    url = require('url'),
    Car = mongoose.model('Car'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    dateExt = require('../common/date-time-extensions');

module.exports = function (carData) {
    return {
        getCarById: function (req, res, next) {
            if (!constants.objectIdPattern.test(req.params.id)) {
                res.status(400)
                    .json({
                        message: 'This is not an Id'
                    });
                return;
            }
            carData.details(req.params.id)
                .then(function (car) {
                    res.json(car);
                }, function (error) {
                    console.log(error);
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
        getAllCars: function (req, res, next) {
            carData.all()
                .then(function (cars) {
                    res.json(cars);
                }, function (error) {
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
        getAllCarModels: function (req, res, next) {
            carData.all()
                .then(function (cars) {
                    var carModels = [];
                    for (let i = 0; i < cars.count; i += 1) {
                        carModels.push(cars[i].model);
                    }

                    res.json(carModels);
                }, function (error) {
                    res.status(error.status)
                        .json({message: error.message});
                })
        },
        // TODO: Decide whether we use two collections or one for cars.
        addCar: function (req, res, next) {
            var car = req.body;
            var user = req.user;

            if (!req.body) {
                res.status(400)
                    .json({
                        message: 'data was not provided!'
                    });
                return;
            }

            if (user.role !== User.getRoles()[2]) {
                res.status(400)
                    .json({
                        message: 'Not authorised!'
                    });
                return;
            }

            //car.wheelsLevel = 1;
            //car.engineLevel = 1;
            //car.turbo = 1;
            //car.damage = 0;
            car.dateCreated = dateExt.getUTCDate(new Date());
            //// TODO: Change according to model.
            //car.price = 1;
            //// TODO: Change according to model.
            //car.levelRequired = 1;

            carData.save(car).then(function (readyCar) {
                res.status(201)
                    .json({
                        carId: readyCar._id
                    });
            }, function (error) {
                res.status(error.status || 500)
                    .json({
                        message: error.message
                    });
            });
        },
        removeCar: function (req, res, next) {
            if (!constants.objectIdPattern.test(req.params.id)) {
                res.status(400)
                    .json({
                        message: 'This is not an Id'
                    });
                return;
            }

            // authenticated User
            var user = req.user;
            var id = req.body.id;

            if (user.role !== User.getRoles()[2]) {
                res.status(401)
                    .json({
                        message: 'permissions required!'
                    });
                return;
            }

            carData.remove(id)
                .then(function (data) {
                    res.json(data);
                }, function (err) {
                    res.status(err.status)
                        .json({
                            message: err.message
                        });
                });
        }
    }
};