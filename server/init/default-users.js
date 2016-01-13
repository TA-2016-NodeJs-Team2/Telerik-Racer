var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    constants = require('../common/constants'),
    SHA256 = require('crypto-js/sha256');

User.findOne({username: 'admin'})
    .exec(function (err, user) {
        'use strict';

        if (!user && !err) {
            User({
                username: 'admin',
                hashPassword: SHA256('admin'),
                cars: [],
                level: constants.models.user.defaultLevel,
                respect: constants.models.user.defaultRespect,
                money: constants.models.user.defaultMoney,
                dateRegistered: new Date(),
                role: constants.roles.administrator
            }).save(function (err) {
                if (err) {
                    console.log('Default user with admin role was not saved!');
                }
            });
        }
    });