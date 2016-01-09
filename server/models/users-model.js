var mongoose = require('mongoose'),
    constants = require('../common/constants'),
    SHA256 = require('crypto-js/sha256');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: constants.models.minLength,
        required: true,
        index: {
            unique: true
        },
        validate: {
            validator: function (val) {
                'use strict';

                return !val.includes(' ');
            },
            message: 'Username should not contain spaces'
        }
    },
    hashPassword: {
        minlength: constants.models.minLengthPass,
        type: String,
        required: true
    },
    token: {
        type: String,
        minlength: constants.models.minLengthPass
    },
    role: {
        type: String,
        enum: [constants.roles.administrator, constants.roles.moderator, constants.roles.regular]
    },
    cars: [Object],
    money: {
        type: Number,
        required: true
    },
    rank: {
        type: Number
    },
    respect: {
        type: Number
    },
    dateRegistered: {
        type: Date,
        required: true
    },
    lastLogin: {
        type: Date
    },
    busyUntil: {
        type: Date
    },
    level: {
        type: Number,
        required: true
    }
});

userSchema.statics.getRoles = function () {
    'use strict';
    return 'regular moderator administrator'.split(' ');
};

var User = mongoose.model('User', userSchema);
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