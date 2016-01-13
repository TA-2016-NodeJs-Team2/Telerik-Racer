'use strict';

var constants = require('../common/constants'),
    notifier = require('node-notifier');

function moneyForRepair(car) {
    var twentyPercentFormPrice = (car.price / 100) * 20;
    return (twentyPercentFormPrice / 100) * car.damage;
}
var moment = require('moment');

module.exports = function (dataUsers) {
    return {
        repair: function (req, res) {
            if (!req.body) {
                return res.json({
                    message: 'Body not found!'
                });
            }

            var car = req.user.cars.filter(function (car) {
                return car.model === req.body.model;
            })[0];

            if (!car) {
                return res.json({
                    message: 'Car not found!'
                });
            }

            var repairCost = moneyForRepair(car);

            if (req.user.money < repairCost) {
                notifier.notify({
                    'title': 'Error',
                    'message': 'You need more money',
                    icon: constants.controllerImgDir + 'notification_error.png'
                });
                res.redirect(req.get('referer'));
            }
            else {
                dataUsers.repairCar(req.user, car, repairCost)
                    .then(function (success) {
                        res.redirect('/profile/cars');
                    }, function (error) {
                        res.json(error);
                    });
            }
        },
        listRacesUserCreated: function (req, res) {
            dataUsers.racesCreatedByUser(req.user.username)
                .then(function (races) {
                    for (var i = 0; i < races.length; i += 1) {
                        races[i].date = moment(races[i].dateCreated).format(' Do MMMM YYYY, HH:mm:ss a');
                        var winnersss = [];
                        for (var j = 0, len = races[i].winners? races[i].winners.length : 0; j < len; j += 1) {
                            console.log(races[i].winners[j]);
                            var chunks = races[i].winners[j].split("|");
                            winnersss.push({
                                name: chunks[0],
                                prize: chunks[1],
                                respect: chunks[2]
                            });
                        }

                        races[i].w = winnersss;
                    }
                    return res.render('profile-views/profile-races', {races: races});
                }, function (err) {
                    return res.redirect('/profile');
                });
        },
        listRacesUserInludedIn: function (req, res) {
            dataUsers.racesWithUser(req.user.username)
                .then(function (races) {
                    for (var i = 0; i < races.length; i += 1) {
                        races[i].date = moment(races[i].dateCreated).format(' Do MMMM YYYY, HH:mm:ss a');
                        var winnersss = [];
                        for (var j = 0, len = races[i].winners? races[i].winners.length : 0; j < len; j += 1) {
                            console.log(races[i].winners[j]);
                            var chunks = races[i].winners[j].split("|");
                            winnersss.push({
                                name: chunks[0],
                                prize: chunks[1],
                                respect: chunks[2]
                            });
                        }

                        races[i].w = winnersss;
                    }
                    return res.render('profile-views/profile-races', {races: races});
                }, function (err) {
                    return res.redirect('/profile');
                });
        },
        listRacesUserCreated: function (req, res) {
            dataUsers.racesCreatedByUser(req.user.username)
                .then(function (races) {
                    for (var i = 0; i < races.length; i += 1) {
                        races[i].date = moment(races[i].dateCreated).format(' Do MMMM YYYY, HH:mm:ss a');
                        var winnersss = [];
                        for (var j = 0, len = races[i].winners? races[i].winners.length : 0; j < len; j += 1) {
                            console.log(races[i].winners[j]);
                            var chunks = races[i].winners[j].split("|");
                            winnersss.push({
                                name: chunks[0],
                                prize: chunks[1],
                                respect: chunks[2]
                            });
                        }

                        races[i].w = winnersss;
                    }
                    return res.render('profile-views/profile-races', {races: races});
                }, function (err) {
                    return res.redirect('/profile');
                });
        },
        listRacesUserInludedIn: function (req, res) {
            dataUsers.racesWithUser(req.user.username)
                .then(function (races) {
                    for (var i = 0; i < races.length; i += 1) {
                        races[i].date = moment(races[i].dateCreated).format(' Do MMMM YYYY, HH:mm:ss a');
                        var winnersss = [];
                        for (var j = 0, len = races[i].winners? races[i].winners.length : 0; j < len; j += 1) {
                            console.log(races[i].winners[j]);
                            var chunks = races[i].winners[j].split("|");
                            winnersss.push({
                                name: chunks[0],
                                prize: chunks[1],
                                respect: chunks[2]
                            });
                        }

                        races[i].w = winnersss;
                    }
                    return res.render('profile-views/profile-races', {races: races});
                }, function (err) {
                    return res.redirect('/profile');
                });
        },
        listCars: function (req, res) {

            for (var i = 0; i < req.user.cars.length; i += 1) {
                req.user.cars[i].costRepair = moneyForRepair(req.user.cars[i]);
            }

            res.render('profile-views/profile-cars', {cars: req.user.cars});
        },
        userInfo: function (req, res) {
            res.render('profile-views/profile', {info: req.user});
        }
    };
};