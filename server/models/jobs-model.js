var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    busyHours: {
        type: Number
    }
});

// tODO: seed Initial jobs
mongoose.model('Job', schema);