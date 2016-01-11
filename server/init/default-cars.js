'use strict';

var mongoose = require('mongoose'),
    Car = mongoose.model('Car');

Car.count({})
    .exec(function (err, count) {
        if (count < 15 && !err) {
            var defaultCars = [];
            defaultCars.push(
                new Car({
                    model: 'Barracuda',
                    wheelsLevel: 1,
                    engineLevel: 1,
                    turbo: 10,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 1,
                    price: 1200,
                    urlImage: 'http://www.musclecarsworld.com/gallery/1973-plymouth-barracuda-in-subleme-green/1973-plymouth-barracuda-in-subleme-green-71.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Ford Mustang',
                    wheelsLevel: 1,
                    engineLevel: 2,
                    turbo: 10,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 1,
                    price: 1500,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2015/05/ford-mustang-felixstowe-beach.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Dodge Coronet',
                    wheelsLevel: 2,
                    engineLevel: 2,
                    turbo: 10,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 1,
                    price: 1900,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/07/1968-Dodge-Coronet-RT-Pro-Touring-451-Street-Wedge-550-HP_179_007.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Dodge Challenger',
                    wheelsLevel: 2,
                    engineLevel: 2,
                    turbo: 30,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 2,
                    price: 2200,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/08/1970-Dodge-Challenger-Convertible-Resto-Mod.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Dodge Charger V10',
                    wheelsLevel: 3,
                    engineLevel: 2,
                    turbo: 30,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 2,
                    price: 3300,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/03/dodge-charger-juiced-concept-v10.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Chevrolet Corvette Stingray',
                    wheelsLevel: 2,
                    engineLevel: 3,
                    turbo: 30,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 2,
                    price: 4800,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/11/2013-SEMA-Show-Chevrolet-Muscle-Cars.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Chevrolet Corvette Hall of Fame Edition',
                    wheelsLevel: 3,
                    engineLevel: 3,
                    turbo: 40,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 3,
                    price: 5500,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/06/2010-Chevrolet-Corvette-Earnhardt-Hall-of-Fame-Edition.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Bumblebee (Camaro)',
                    wheelsLevel: 4,
                    engineLevel: 4,
                    turbo: 30,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 3,
                    price: 7500,
                    urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/06/transformers-4-bumblebee-1967-camaro-ss.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Chevrolet Corvette Stingray NEW',
                    wheelsLevel: 5,
                    engineLevel: 3,
                    turbo: 60,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 3,
                    price: 9000,
                    urlImage: 'http://www.musclecarsworld.com/gallery/bumblebee-is-a-mean-1967-camaro-ss-in-transformers-4/chevrolet-corvette-stingray-transformers4.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Bugatti Veyron',
                    wheelsLevel: 5,
                    engineLevel: 5,
                    turbo: 55,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 4,
                    price: 11000,
                    urlImage: 'http://www.musclecarsworld.com/gallery/bumblebee-is-a-mean-1967-camaro-ss-in-transformers-4/bugatti-veyron-transformers4.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Lamborghini Aventador',
                    wheelsLevel: 5,
                    engineLevel: 7,
                    turbo: 50,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 4,
                    price: 14500,
                    urlImage: 'http://www.musclecarsworld.com/gallery/bumblebee-is-a-mean-1967-camaro-ss-in-transformers-4/lamborghini-aventador-transformers4.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Chevrolet Camaro SS RCR',
                    wheelsLevel: 6,
                    engineLevel: 8,
                    turbo: 70,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 4,
                    price: 16300,
                    urlImage: 'http://www.musclecarsworld.com/gallery/1973-plymouth-barracuda-in-subleme-green/1973-plymouth-barracuda-in-subleme-green-71.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Ford Mustang FR500S',
                    wheelsLevel: 9,
                    engineLevel: 6,
                    turbo: 70,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 5,
                    price: 20000,
                    urlImage: 'http://s100.iracing.com/wp-content/uploads/2012/11/fordmustangfr500s-small.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'MCLAREN MP4-12C GT3',
                    wheelsLevel: 7,
                    engineLevel: 9,
                    turbo: 80,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 5,
                    price: 22500,
                    urlImage: 'http://s100.iracing.com/wp-content/uploads/2012/11/mclarenmp412cgt3-small.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'BMW Z4 GT3',
                    wheelsLevel: 8,
                    engineLevel: 9,
                    turbo: 75,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 5,
                    price: 25000,
                    urlImage: 'http://s100.iracing.com/wp-content/uploads/2013/12/bmwz4gt3-small.jpg'
                })
            );
            defaultCars.push(
                new Car({
                    model: 'Telerik-Radical SR8 V8',
                    wheelsLevel: 9,
                    engineLevel: 9,
                    turbo: 90,
                    damage: 0,
                    dateCreated: new Date(),
                    levelRequired: 6,
                    price: 29000,
                    urlImage: 'http://s100.iracing.com/wp-content/uploads/2012/10/tile_radical-sr8-2015-1024x576.jpg'
                })
            );

            for (var i = 0; i < defaultCars.length; i += 1) {
                defaultCars[i].save(function (err) {
                    if (err) {
                        console.log('Cannot save car!');
                    }
                });
            }
        }
    });