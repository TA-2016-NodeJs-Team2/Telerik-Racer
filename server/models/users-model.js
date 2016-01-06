var mongoose = require('mongoose');

let schema = new mongoose.Schema({
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
        minlength: 10,
        required: true
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

mongoose.model('User', schema);