'use strict';

var mongoose = require('mongoose'),
    Car = mongoose.model('Car'),
    BBPromise = require('bluebird');

module.exports = {
    getCarById: function (id) {
        // TODO: Find a specific car by ObjectId
        return new BBPromise(function (resolve, reject) {
            Car.find({_id: id})
                .exec(function (err, car) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(car);
                });
        });
    },
    getAllCars: function () {
        // TODO: See all player's cars.
        return new BBPromise(function (resolve, reject) {
            Car.find()
                .exec(function (err, cars) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(cars);
                });
        });
    },
    addCar: function (newCar) {
        // TODO: When player chooses a car.
        return new BBPromise(function (resolve, reject) {
            var dbUser = new Car(newCar);

            dbUser.save(function (err, car) {
                if (err) {
                    return reject(err);
                }
                resolve(car);
            });
        });
    },
    removeCar: function (id) {
        // TODO: When player dismisses a car.
        return new BBPromise(function (resolve, reject) {
            Car.remove({_id: id}, function (err, rawData) {
                if (err) {
                    return reject({
                        status: 400,
                        message: 'wrong id!'
                    });
                }

                resolve({
                    status: rawData.result.ok,
                    documentsModified: rawData.result.n,
                    message: rawData.result.n !== 0 ? 'removed!' : 'car not found'
                });
            });
        });
    }
};