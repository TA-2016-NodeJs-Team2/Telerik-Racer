'use strict';

var constants = require('../common/constants'),
    path = require('path');

var notifyError = {
    'title': 'Error',
    icon: path.join(__dirname, '../../imgs/', 'notification_error.png'),
    time: 2000
};

module.exports = function (maps, notifier) {
    return {
        getAll: function (req, res) {
            maps.all(req.query)
                .then(function (responseMaps) {
                    res.render('map-views/maps', {
                        maps: responseMaps,
                        query: req.query
                    });
                }, function (err) {
                    res.status(err.status || 400)
                        .json({
                            message: err.message
                        });
                });
        },
        getDetails: function (req, res) {

            // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
            if (!constants.objectIdPattern.test(req.params.id)) {
                notifyError.message = 'Wrong url';
                notifier.notify(notifyError);
                return res.status(400)
                    .redirect('/maps/all');
            }

            maps.details(req.params.id)
                .then(function (responseMap) {
                    res.render('map-views/map-detail', {map: responseMap});
                }, function (err) {
                    notifyError.message = err.message;
                    notifier.notify(notifyError);
                    res.status(err.status || 400)
                        .redirect('/maps/all');
                });
        },
        add: function (req, res) {
            if (!req.body) {
                notifyError.message = 'Map was not provided';
                notifier.notify(notifyError);
                return res.status(400)
                    .redirect('/maps/add');
            }

            var map = req.body;
            map.date = new Date();

            map.prizes = [];
            map.respectGiven = [];

            var minLength = constants.models.minLengthPrizes;

            for (var i = 1; i <= minLength; i += 1) {
                var prize = req.body['prize' + i];
                var respect = req.body['respect' + i];
                if (prize && !isNaN(prize) && (+prize >= 0)) {
                    map.prizes.push(+prize);
                }

                if (respect && !isNaN(respect) && (+respect >= 0)) {
                    map.respectGiven.push(+respect);
                }
            }

            if (map.damageToTake > 100) {
                notifyError.message = 'Map damage can be from 0 to 100';
                notifier.notify(notifyError);
                return res.status(400)
                    .redirect('/maps/add');
            }

            if (map.prizes.length !== minLength ||
                map.respectGiven.length !== minLength) {

                notifyError.message = 'Prizes and respects should be ' + minLength + ' positive numbers!';
                notifier.notify(notifyError);
                return res.status(400)
                    .redirect('/maps/add');
            }

            map.prizes.sort(function (a, b) {
                return a < b;
            });
            map.respectGiven.sort(function (a, b) {
                return a < b;
            });

            maps.save(map)
                .then(function (responseMar) {
                    res.redirect('/maps/' + responseMar._id);
                }, function (err) {
                    notifyError.message = 'Cannot save map!';
                    notifier.notify(notifyError);
                    res.status(err.status || 400)
                        .redirect('/maps/add');
                });
        },
        addForm: function (req, res) {
            return res.render('map-views/map-add');
        },
        delete: function (req, res) {
            // Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
            if (!constants.objectIdPattern.test(req.params.id)) {
                notifyError.message = 'Wrong url';
                notifier.notify(notifyError);
                return res.status(400)
                    .redirect('/maps/all');
            }

            maps.remove(req.params.id)
                .then(function (result) {
                    res.redirect('/maps/all');
                }, function (err) {

                    notifyError.message = err.message;
                    notifier.notify(notifyError);
                    res.status(err.status || 400)
                        .redirect(req.get('referer'));
                });
        }
    };
};