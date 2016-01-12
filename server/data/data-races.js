'use strict';

var mongoose = require('mongoose'),
    RaceModel = mongoose.model('Race'),
    BBPromise = require('bluebird');

module.exports = {
    all: function (query) {
        return new BBPromise(function (resolve, reject) {
            RaceModel.find({})
                .skip((query.page - 1) * query.size)
                .limit(1*query.size)
                .sort(query.by)
                .exec(function (err, races) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(races);
                });
        });
    },
    details: function (id) {
        return new BBPromise(function (resolve, reject) {
            RaceModel.findById(id)
                .exec(function (err, race) {
                    if (err) {
                        return reject(err);
                    }

                    if (!race) {
                        return reject({
                            status: 404,
                            message: 'Race not found'
                        });
                    }

                    resolve(race);
                });
        });
    },

    save: function (newRace) {
        return new BBPromise(function (resolve, reject) {
            var dbRace = new RaceModel(newRace);
            dbRace.save(function (err, race) {
                if (err) {
                    return reject(err);
                }

                resolve(race);
            });
        });
    },
    remove: function (id) {
        return new BBPromise(function (resolve, reject) {
            RaceModel.remove({_id: id}, function (err, rawData) {
                if (err || rawData.result.n === 0) {
                    return reject({
                        status: 404,
                        message: 'Race not found'
                    });
                }

                resolve({
                    status: rawData.result.ok,
                    documentsModified: rawData.result.n,
                    message: 'Race removed!'
                });
            });
        });
    }
};