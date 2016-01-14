'use strict';
var BBPromise = require('bluebird');

module.exports = {

    details: function (map) {
        map = {
            prizes: [20, 30],
            respectGiven: [10,20]
        };
        return new BBPromise(function (resolve, reject) {
            resolve(map);
        });
    },

    getAllAsJson: function () {
        return new BBPromise(function (resolve, reject) {
            resolve({});
        });
    }
};