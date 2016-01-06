'use strict';

var express = require('express'),
    app = express(),
    port = 9001;

require('./server/models/');

app.listen(port, function () {
    console.log('server is running on http://localhost:' + port + '/');
});
