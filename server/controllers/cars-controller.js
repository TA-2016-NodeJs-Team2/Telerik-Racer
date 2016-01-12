'use strict';

var mongoose = require('mongoose'),
    url = require('url'),
    notifier = require('node-notifier'),
    path = require("path"),
    Car = mongoose.model('Car'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    dateExt = require('../common/date-time-extensions');

module.exports = function (carData) {
    return {
        getCarById: function (req, res, next) {
            var currentUser = req.user;
            if (!constants.objectIdPattern.test(req.params.id)) {
                res.status(400)
                    .json({
                        message: 'This is not an Id'
                    });
                return;
            }

            carData.details(req.params.id)
                .then(function (car) {
                    var canBuy = true;
                    for (let i = 0; i < currentUser.cars.length; i += 1) {
                        if (currentUser.cars[i].model === car.model) {
                            canBuy = false;
                            break;
                        }
                    }

                    res.status(200);
                    res.render('cars/car',
                        {
                            message: "Buy or buy not, there's no try",
                            auser: {
                                name: currentUser ? currentUser.username : undefined,
                                authorized: req.app.locals.user,
                                canBuy: canBuy
                            },
                            car: car
                        }
                    );
                }, function (error) {
                    console.log(error);
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
        getAllCars: function (req, res, next) {
            var currentUser = req.app.locals.user;

            carData.all(req.query.page, req.query.size, req.query.sort, req.query.by)
                .then(function (cars) {
                    var page = (req.query.page * 1) || 1;
                    res.status(200);
                    res.render('cars/all-cars',
                        {
                            message: "Buy or buy not, there's no try",
                            auser: {
                                name: currentUser ? currentUser.username : undefined,
                                authorized: req.app.locals.user
                            },
                            cars: cars,
                            pageSize: req.query.size,
                            isAscending: req.query.sort === 'asc',
                            by: req.query.by,
                            nextPage: function () {
                                return page + 1;
                            },
                            prevPage: function () {
                                return page - 1;
                            }
                        }
                    );
                }, function (error) {
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
        // TODO: Decide if we need this.
        //getAllCarModels: function (req, res, next) {
        //    console.log(req.query);
        //    carData.all(req.query.skip, req.query.take, req.query.sort, req.query.by)
        //        .then(function (cars) {
        //            var carModels = [];
        //            for (let i = 0; i < cars.count; i += 1) {
        //                carModels.push(cars[i].model);
        //            }
        //
        //            res.json(carModels);
        //        }, function (error) {
        //            res.status(error.status)
        //                .json({message: error.message});
        //        })
        //},
        buyCar: function (req, res, next) {
            var currUserId = req.user._id;
            if (!constants.objectIdPattern.test(req.params.id)) {
                res.status(400)
                    .json({
                        message: 'This is not an Id'
                    });
                return;
            }
            carData.details(req.params.id)
                .then(function (car) {
                    User.findById(currUserId)
                        .exec(function (err, user) {
                            if (err) throw err;

                            if (user.money < car.price) {
                                // notify no money=
                                var imgDir = path.join(__dirname, '../../imgs/', 'notification_error.png');
                                notifier.notify({
                                    'title': 'Error',
                                    'message': 'Not enough money!',
                                    icon: imgDir
                                });
                                return;
                            }

                            // user.money -= car.price;
                            user.cars.push(car);
                            user.save();
                        });

                    // Notify successfully bought. Redirect?
                    res.redirect('/shop/cars/' + req.params.id);
                }, function (error) {
                    console.log(error);
                    res.status(error.status)
                        .json({message: error.message});
                });
        },
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
            //car.price = 1;
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