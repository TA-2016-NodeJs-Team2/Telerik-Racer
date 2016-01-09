var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        index: {
            unique: true
        }
    },
    prizes: {
        type: [Number],
        required: true
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

// TODO: seed initial maps
mongoose.model('Map', schema);