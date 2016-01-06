'use strict';

var fs = require('fs');
// TODO:
module.exports = function (app) {
    fs.readdirSync('./controllers')
        .filter(file => file !== 'index.js')
        .forEach(file => require(`./${file}`)(app));
};