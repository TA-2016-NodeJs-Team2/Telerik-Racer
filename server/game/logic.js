'use strict';
/*var race = require('./test-data'),
 usersData = require('./test-date-db');*/
var BBPromise = require('bluebird');

function getPoints(car) {
    return 30 + ((car.wheelsLevel / 100) * 10) +
        ((car.engineLevel / 100) * 30) +
        (car.turbo / 5) +
        (car.wheelsLevel * car.engineLevel) +
        car.levelRequired - (car.damage - ((car.damage / 100) * 20));
}

/**
 *
 * @param {Schema.model} UserModel Users schema model from mongoose
 * @param {Schema.model} RaceModel Races schema model from mongoose
 * @param {Schema.model} race Race to complete
 */
function makeRace(UserModel, RaceModel, race) {

    function update(username, prize, respect, carModel, damage) {
        return new BBPromise(function (resolve, reject) {

            UserModel.findOne({username: username})
                .exec(function (err, dbUser) {
                    if (err || !dbUser) {
                        return reject({message: 'User not found!', error: err});
                    }

                    dbUser.money += prize;
                    dbUser.respect += respect;

                    if (shouldItLevelUp(dbUser)) {
                        dbUser.level += 1;
                    }

                    // find car to apply damage
                    for (var j = 0; j < dbUser.cars.length; j += 1) {
                        if (dbUser.cars[j].model === carModel) {
                            dbUser.cars[j].damage += damage;

                            if (dbUser.cars[j].damage > 100) {
                                dbUser.cars[j].damage = 100;
                            }

                            dbUser.save(function (saveError) {
                                if (saveError) {
                                    return reject({message: 'Cannot save user!', error: saveError});
                                }

                                RaceModel.findById(race._id)
                                    .exec(function (fError, dbRace) {
                                        if (fError || !dbRace) {
                                            return reject({message: 'Race not found!', error: fError});
                                        }

                                        // TODO: what should be the finished status
                                        dbRace.status = 'Finished';
                                        dbRace.save(function (sErr) {
                                            if (sErr) {
                                                return reject({message: 'Cannot save race!', error: sErr});
                                            }

                                            resolve({message: 'Race and user updated!'});
                                        });
                                    });
                            });
                        }
                    }

                });
        });
    }

    function shouldItLevelUp(user) {
        var toNextLevel = (user.level * 100);
        toNextLevel += (toNextLevel / 100) * 20;
        return toNextLevel <= user.respect;
    }

    race.users.sort(function (a, b) {

        var valueA = getPoints(a.car),
            valueB = getPoints(b.car);

        if (valueA > valueB) {
            return -1;
        }

        if (valueA < valueB) {
            return 1;
        }

        if (a.respect < b.respect) {
            return -1;
        }

        if (a.respect > b.respect) {
            return 1;
        }

        return 0;

    });

    for (var i = 0, pr = Math.abs(race.users.length - 5); i < race.users.length; i += 1, pr += 1) {
        update(race.users[i].username, race.map.prizes[pr], race.map.respectGiven[pr], race.users[i].car.model, race.map.damageToTake)
            .then(function (successMessage) {
                //console.log(successMessage.message); Race and user saved!
            }, function (error) {
                return false;
            });
    }

    return true;
}

function moneyForRepair(car) {
    var twentyPercentFormPrice = (car.price / 100) * 20;
    return (twentyPercentFormPrice / 100) * car.damage;
}

module.exports = {
    makeRace: makeRace,
    getRepairCost: moneyForRepair
};
