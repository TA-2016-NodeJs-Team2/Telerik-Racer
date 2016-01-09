var mongoose = require('mongoose'),
    constants = require('../common/constants');

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
        enum: 'regular moderator administrator'.split(' ')
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

mongoose.model('User', userSchema);