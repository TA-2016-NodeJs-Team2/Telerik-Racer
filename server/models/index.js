'use strict';

var fs = require('fs'),
    path ='./server/models/';

module.exports = function () {
    fs.readdirSync(path)
        .filter(file => file !== 'index.js')
        .forEach(file => require( './' + file));
};