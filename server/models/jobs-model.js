var mongoose = require('mongoose');

let schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    moneyForOnce: {
        type: Number,
        required: true
    },
    busyHours: {
        type: Number
    }
});

mongoose.model('Job', schema);