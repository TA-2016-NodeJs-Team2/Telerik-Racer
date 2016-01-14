'use strict';
var BBPromise = require('bluebird');

module.exports = {

    details: function (newRace) {
        return new BBPromise(function (resolve, reject) {
            resolve(newRace);
        });
    },

    save: function(){

    }

};