'use strict';

var mongoose = require('mongoose'),
    MapModel = mongoose.model('Map'),
    BBPromise = require('bluebird');

module.exports = {
    all: function (query) {
        return new BBPromise(function (resolve, reject) {
            MapModel.find({})
                .skip((query.page - 1) * query.size)
                .limit(query.size)
                .sort(query.by)
                .exec(function (err, users) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(users);
                });
        });
    },
    getAllAsJson: function(){
        return new BBPromise(function (resolve, reject) {
            MapModel.find({})
                .sort('name')
                .select('name')
                .exec(function (err, users) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(users);
                });
        });
    },
    details: function (id) {
        return new BBPromise(function (resolve, reject) {
            MapModel.findById(id)
                .exec(function (err, map) {
                    if (err) {
                        return reject(err);
                    }

                    if (!map) {
                        return reject({
                            status: 404,
                            message: 'Map not found'
                        });
                    }

                    resolve(map);
                });
        });
    },
    save: function (newMap) {
        return new BBPromise(function (resolve, reject) {
            var dbMap = new MapModel(newMap);
            dbMap.save(function (err, map) {
                if (err) {
                    return reject(err);
                }

                resolve(map);
            });
        });
    },
    remove: function (id) {
        console.log(id);
        return new BBPromise(function (resolve, reject) {
            MapModel.findByIdAndRemove(id, function (err) {
                if (err) {
                    return reject({
                        status: 404,
                        message: 'map not found'
                    });
                }

                resolve({
                    message: 'Map removed!'
                });
            });
        });
    }
};