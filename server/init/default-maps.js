'use strict';

var mongoose = require('mongoose'),
    MapModel = mongoose.model('Map'),
    constants = require('../common/constants');

MapModel.count({})
    .exec(function (err, countOfMaps) {
        if (err) {
            console.log('Cannot count maps!');
        }

        if (countOfMaps < 5) {
            seedMaps();
        }
    });

function seedMaps() {
    var defaultMaps = [];
    defaultMaps.push(
        new MapModel({
            name: 'Desert',
            prizes: [800, 700, 500, 350, 200],
            respectGiven: [30, 20, 15, 10, 5],
            damageToTake: 25,
            date: new Date()
        }));

    defaultMaps.push(
        new MapModel({
            name: 'Mountains',
            prizes: [1200, 1000, 600, 450, 300],
            respectGiven: [40, 30, 20, 15, 10],
            damageToTake: 40,
            date: new Date()
        }));

    defaultMaps.push(
        new MapModel({
            name: 'City',
            prizes: [900, 750, 600, 350, 200],
            respectGiven: [40, 30, 20, 15, 10],
            damageToTake: 30,
            date: new Date()
        }));

    defaultMaps.push(
        new MapModel({
            name: 'Airport',
            prizes: [1300, 1100, 800, 450, 300],
            respectGiven: [40, 30, 20, 15, 10],
            damageToTake: 50,
            date: new Date()
        }));

    defaultMaps.push(
        new MapModel({
            name: 'Training',
            prizes: [0, 0, 0, 0, 0],
            respectGiven: [0, 0, 0, 0, 0],
            damageToTake: 0,
            date: new Date()
        }));

    for (var i = 0; i < defaultMaps.length; i += 1) {
        defaultMaps[i].save(function (err) {
            if (err) {
            	console.log('Cannot save this map!');
            }
        });
    }
}