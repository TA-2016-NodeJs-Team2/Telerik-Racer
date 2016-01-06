'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express(),
    port = 9001,
    connectionString = 'mongodb://localhost/telerik-racer';

app.use(bodyParser.json());

mongoose.connect(connectionString);

require('./server/models/')();
require('./server/config/authentication-config');
require('./server/routers')(app);


app.listen(port, function () {
    console.log('server is running on http://localhost:' + port + '/');
});
