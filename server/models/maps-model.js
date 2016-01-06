var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: Date,
        required: true
    },
    prices: {
        type: [Number],
        required: true
    },
    respectGiven: {
        type: [Number]
    },
    damageToTake: {
        type: Number
    }
});

// TODO: seed initial maps
mongoose.model('Map', schema);