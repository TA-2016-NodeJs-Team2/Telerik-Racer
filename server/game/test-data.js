var race = {
    map: {
        damageToTake: 20,
        prizes: [500, 400, 350, 150, 100],
        respectGiven: [30, 40, 20, 15, 10]
    },
    users: [{
        username: 'pesho',
        car: {
            model: 'Dodge Charger V10',
            wheelsLevel: 3,
            engineLevel: 2,
            turbo: 30,
            damage: 0,
            dateCreated: new Date(),
            levelRequired: 2,
            price: 3300,
            urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/03/dodge-charger-juiced-concept-v10.jpg'
        },
        level: 1,
        respect: 20,
        money: 650
    }, {
        username: 'ivan',
        car: {
            model: 'Chevrolet Corvette Hall of Fame Edition',
            wheelsLevel: 3,
            engineLevel: 3,
            turbo: 40,
            damage: 0,
            dateCreated: new Date(),
            levelRequired: 3,
            price: 5500,
            urlImage: 'http://www.musclecarsworld.com/wp-content/uploads/2013/06/2010-Chevrolet-Corvette-Earnhardt-Hall-of-Fame-Edition.jpg'
        },
        level: 1,
        respect: 1,
        money: 90
    }]
};

module.exports = race;