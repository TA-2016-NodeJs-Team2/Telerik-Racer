var mongoose = require('mongoose'),
    constants = require('../common/constants');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: constants.models.minLength,
        index: {
            unique: true
        }
    },
    prizes: {
        type: [Number],
        required: true,
        validate: {
            validator: function (val) {
                'use strict';

                return val.length === constants.models.minLengthPrizes;
            },
            message: 'Should have' + constants.models.minLengthPrizes + 'prizes!'
        }
    },
    respectGiven: {
        type: [Number]
    },
    damageToTake: {
        type: Number
    },
    date: {
        type: Date
    }
});

mongoose.model('Map', schema);