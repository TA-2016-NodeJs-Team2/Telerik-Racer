'use strict';

var fs = require('fs'),
    path = './server/init';

fs.readdirSync(path)
    .filter(file => file !== 'index.js')
    .forEach(file => require('./' + file));
