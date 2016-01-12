var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true
    },
    users: [String],
    cars: [String],
    status: {
        type: String
    },
    creator: {
        type: String
    },
    map: {
        type: String
    }
});

mongoose.model('Race', schema);