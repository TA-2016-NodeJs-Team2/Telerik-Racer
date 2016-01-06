var mongoose = require('mongoose');

let schema = new mongoose.Schema({
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
    }
});

// TODO: Seed initial cars
console.log('Cars loaded!');
mongoose.model('Car', schema);