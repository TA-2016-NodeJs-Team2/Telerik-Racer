'use strict';

var mongoose = require('mongoose'),
    Car = mongoose.model('Car'),
    BBPromise = require('bluebird');

module.exports = {
    details: function (id) {
        // TODO: Find a specific car by ObjectId
        return new BBPromise(function (resolve, reject) {
            Car.findById(id)
                .exec(function (err, car) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(car);
                });
        });
    },
    all: function (skip, take, sort, by) {
        return new BBPromise(function (resolve, reject) {
            skip = skip || 1;
            take = take || 10;
            sort = sort || 'asc';
            by = by || 'price';
            var sortOpts = {};
            sortOpts[by] = sort;

            Car.find()
                .skip((skip - 1) * take)
                .limit(take * 1)
                .sort(sortOpts)
                .exec(function (err, cars) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(cars);
                });
        });
    },
    save: function (newCar) {
        return new BBPromise(function (resolve, reject) {
            var dbCar = new Car(newCar);

            dbCar.save(function (err, car) {
                if (err) {
                    return reject(err);
                }
                resolve(car);
            });
        });
    },
    remove: function (id) {
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