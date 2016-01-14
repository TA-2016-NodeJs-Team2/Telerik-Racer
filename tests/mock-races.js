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
        if(newRace == '123') {
            var response = {
                users: ["TestUser"],
                winners: ["Test1"],
                cars: [],
                usersIds: [],
                save: function (callback) {

                    callback(undefined, []);
                },
                creator: "TestCreator",
                status: "Waiting for opponents",
                mapId: "3189"
            };
        }else{
            var response = {
                users: ["TestUser", "Test2"],
                winners: [],
                cars: [
                {
                    model: "Trabant",
                    damage: 0,
                    save: function(){

                    }
                },
                {
                    model: "Test car",
                    damage: 0,
                    save: function(){

                    }
                }],
                usersIds: [],
                save: function (callback) {
                    if(callback) {
                        callback(undefined, []);
                    }
                },
                creator: "TestCreator",
                status: "Waiting for opponents",
                mapId: "3189"
            };
        }
        return new BBPromise(function (resolve, reject) {
            resolve(response);
        });
    }
};