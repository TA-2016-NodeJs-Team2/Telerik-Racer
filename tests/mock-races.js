'use strict';
var BBPromise = require('bluebird');

var maps = ['Map1', 'Map2', 'Map3', 'Map4', 'Map5', 'Map6', 'Map7', 'Map8', 'Map9', 'Map10', 'Map11', 'Map12', 'Map123'];

module.exports = {
    all: function (query) {
        var start = (query.page - 1) * query.size;
        var result = maps.slice(start, start + query.size);

        return {
            then: function (res, rej) {
                res(result);
            }
        };
    },

    save: function (newRace) {
        newRace._id = '123';
        return new BBPromise(function (resolve, reject) {
            resolve(newRace);
        });
    },
    details: function (newRace) {
        var response = {
            users: ["TestUser", "Test2"],
            winners: ["Test1", "Test2"]
        };

        return new BBPromise(function (resolve, reject) {
            resolve(response);
        });
    }
};