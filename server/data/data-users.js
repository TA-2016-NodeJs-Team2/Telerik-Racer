'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    RaceModel = mongoose.model('Race'),
    BBPromise = require('bluebird'),
    SHA256 = require('crypto-js/sha256');

module.exports = {
    save: function (newUser) {
        return new BBPromise(function (resolve, reject) {
            var dbUser = new User(newUser);
            dbUser.save(function (err, user) {
                if (err) {
                    err.message = err.code === 11000 ? 'Username taken' : err.message;
                    return reject(err);
                }
                resolve(user);
            });
        });
    },
    login: function (userToLog) {
        return new BBPromise(function (resolve, reject) {
            User.findOne({username: userToLog.username})
                .exec(function (err, dbUser) {
                    if (err) {
                        return reject(err);
                    }

                    // user not found
                    if (!dbUser) {
                        return reject({
                            status: 404,
                            message: userToLog.username + ' not found!'
                        });
                    }

                    // like SHA256(user.password).toString(); -> https://jsperf.com/tostring-vs-v3/2
                    var hashedPassword = SHA256(userToLog.password) + '';

                    // password mismatch!
                    if (dbUser.hashPassword !== hashedPassword) {
                        return reject({
                            status: 400,
                            message: 'password mismatch'
                        });
                    }

                    if (!dbUser.token) {
                        dbUser.token = SHA256(dbUser.username + ' ' + dbUser.password) + '';
                    }

                    // TODO: if lastLogin data is more than 72 hours -> generate a new token

                    dbUser.lastLogin = new Date();
                    dbUser.save();

                    resolve({
                        username: dbUser.username,
                        token: dbUser.token
                    });
                });
        });
    },
    remove: function (id) {
        return new BBPromise(function (resolve, reject) {
            User.findByIdAndRemove(id).exec( function (err, rawData) {
                if (err) {
                    return reject({
                        status: 400,
                        message: 'wrong id!'
                    });
                }

                resolve({
                    message: 'User removed!'
                });
            });
        });
    },
    all: function (query) {
        return new BBPromise(function (resolve, reject) {
            User.find({})
                .skip((query.page - 1) * query.size)
                .limit(query.size)
                .sort(query.by)
                .select('role username level money')
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
            User.findById(id)
                .exec(function (err, user) {
                    if (err) {
                        return reject(err);
                    }

                    if (!user) {
                        return reject({
                            message: 'Not found'
                        });
                    }

                    resolve(user);
                });
        });
    },
    update: function (id, model) {
        return new BBPromise(function (resolve, reject) {
            User.update({_id: id}, model, {multi: false}, function (err, rowAffected) {
                if (err) {
                    return reject({
                        message: err.message
                    });
                }

                resolve(rowAffected);
            });
        });
    },
    racesCreatedByUser: function (username) {
        return new BBPromise(function (resolve, reject) {
           RaceModel.find({creator: username})
                .exec(function (err, races) {
                   if (err) {
                   	   return reject(err);
                   }

                    resolve(races);
                });
        });
    },
    repairCar: function (user, car, repairCost) {
        return new BBPromise(function (resolve, reject) {
            User.update({"username": user.username, "cars.model": car.model}, {
                $set: {
                    "cars.$.damage": 0
                },
                $inc: {
                    money: -repairCost
                }
            }, function (err, rowAffected) {
                if (err) {
                    return reject({
                        message: 'Cannot repair your car'
                    });
                }

                resolve('Done!');
            });
        });
    }
};

