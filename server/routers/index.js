'use strict';

var fs = require('fs');

module.exports = function (app) {
    fs.readdirSync('./routers')
        .filter(file => file !== 'index.js')
        .forEach(file => require(`./${file}`)(app));
};