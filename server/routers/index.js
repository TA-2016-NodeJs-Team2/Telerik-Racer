'use strict';

var fs = require('fs'),
    path = './server/routers/';

module.exports = function (app) {
    fs.readdirSync(path)
        .filter(file => file !== 'index.js')
        .forEach(file => require('./' + file)(app));
};