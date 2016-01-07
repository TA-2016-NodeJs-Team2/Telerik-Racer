var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    wheelsLevel: {
        type: Number,
        required: true
    },
    engineLevel: {
        type: Number,
        required: true
    },
    turbo: {
        type: Number,
        required: true
    },
    urlImage: {
        type: String
    },
    damage: {
        type: Number,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    price : {
        type: Number,
        required: true
    },
    levelRequired: {
        type: Number,
        required: true
    }
});

// TODO: Seed initial cars
mongoose.model('Car', schema);