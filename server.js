'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    app = express(),
    port = process.env.PORT || 9001,
    connectionString = 'mongodb://localhost/telerik-racer';

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

mongoose.connect(connectionString);

require('./server/models/')();
require('./server/init');
require('./server/config/authentication-config')(app);
require('./server/routers')(app);


app.listen(port, function () {
    console.log('server is running on http://localhost:' + port + '/');
});
