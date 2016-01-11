'use strict';

var mongoose = require('mongoose'),
    url = require('url'),
    Car = mongoose.model('Car'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId,
    dateExt = require('../common/date-time-extensions');

module.exports = function (carData) {
    return {
        getCarById: function (req, res, next) {
            var id = req.params.id;
            var objId = new ObjectId(id);
            carData.details(objId)
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
                    for(let i = 0; i < cars.count; i+=1){
                        carModels.push(cars[i].model);
                    }

                    res.json(carModels);
                }, function (error) {
                    res.status(error.status)
                        .json({message: error.message});
                })
        },
        // TODO: Decide whether we use two collections or one for cars.
        //addCar: function (req, res, next) {
        //    var car = req.body;
        //
        //    if (!req.body) {
        //        res.status(400)
        //            .json({
        //                message: 'data was not provided!'
        //            });
        //        return;
        //    }
        //
        //    //TODO:  || !(car.levelRequired < player.Level) - user controller needs - getCurrentPlayer
        //    if (!(car.model)) {
        //        res.status(400)
        //            .json({
        //                message: 'Username and password are required!'
        //            });
        //        return;
        //    }
        //
        //    car.wheelsLevel = 1;
        //    car.engineLevel = 1;
        //    car.turbo = 1;
        //    car.damage = 0;
        //    car.dateCreated = dateExt.getUTCDate(new Date());
        //    // TODO: Change according to model.
        //    car.price = 1;
        //    // TODO: Change according to model.
        //    car.levelRequired = 1;
        //
        //    carData.save(car).then(function (readyCar) {
        //        res.status(201)
        //            .json({
        //                carId: readyCar._id
        //            });
        //    }, function (error) {
        //        res.status(error.status || 500)
        //            .json({
        //                message: error.message
        //            });
        //    });
        //},
        removeCar: function (req, res, next) {
            if (!(req.body) || !(req.body.id)) {
                res.status(400)
                    .json({
                        message: 'you should provide an ID!'
                    });
                return;
            }

            // authenticated User
            var user = req.user;
            var id = req.body.id;

            // User should have role administrator.
            console.log(user.role);
            console.log(User.getRoles()[2]);

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