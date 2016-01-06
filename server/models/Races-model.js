var mongoose = require('mongoose');

let schema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true
    },
    users: [String],
    status: {
        type: String
    }
});

mongoose.model('Race', schema);