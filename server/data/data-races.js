'use strict';

var mongoose = require('mongoose'),
    RaceModel = mongoose.model('Race'),
    BBPromise = require('bluebird');

module.exports = {
    all: function (page, size, sort, only) {
        return new BBPromise(function (resolve, reject) {
            if (page * 1 < 0) {
                page = 0;
            }
            if (size * 1 < 0) {
                size = 0;
            }
            page = (page * 1) || 1;
            size = (size * 1) || 10;
            sort = sort || 'asc';
            var by = 'dateCreated';
            var sortOpts = {};
            sortOpts[by] = sort;

            only = only || 'start';

            RaceModel.find({})
                .skip((page - 1) * size)
                .limit(1*size)
                .sort(sortOpts)
                .exec(function (err, races) {
                    if (err) {
                        return reject(err);
                    }
                    var racesToShow = [];

                    for(var i=0; i<races.length; i++){
                        if(only === 'start'){
                            if(races[i].status === 'Waiting for opponents'){
                                racesToShow.push(races[i]);
                            }
                        }else{
                            if(races[i].status !== 'Waiting for opponents'){
                                racesToShow.push(races[i]);
                            }
                        }
                    }

                    resolve(racesToShow);
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