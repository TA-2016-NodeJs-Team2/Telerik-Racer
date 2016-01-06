'use strict';

var fs = require('fs');

module.exports = function () {
    fs.readdirSync('./models')
        .filter(file => file !== 'index.js')
        .forEach(file => require(`./${file}`));
};