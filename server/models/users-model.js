var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true,
        index: {
            unique: true
        }
    },
    hashPassword: {
        minlength: 10,
        type: String,
        required: true
    },
    token: {
        type: String,
        minlength: 10
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

// TODO: expiresTokenDate

userSchema.statics.getRoles = function () {
    'use strict';
    return 'regular moderator administrator'.split(' ');
};

mongoose.model('User', userSchema);