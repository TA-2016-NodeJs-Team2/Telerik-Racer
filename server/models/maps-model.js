var mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: Date,
        required: true
    },
    prices: {
        type: [Number],
        required: true
    },

    damageToTake: {
        type: Number
    }
});

mongoose.model('Map', schema);