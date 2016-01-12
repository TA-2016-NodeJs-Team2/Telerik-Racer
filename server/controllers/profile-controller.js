'use strict';

function moneyForRepair(car) {
    var twentyPercentFormPrice = (car.price / 100) * 20;
    return (twentyPercentFormPrice / 100) * car.damage;
}

module.exports = function (dataUsers) {
    return {
        repair: function (req, res) {
            if (!req.body) {
                return res.json({
                    message: 'Body not found!'
                });
            }

            var car = req.user.cars.filter(function (car) {
                return car.model === req.body.model;
            })[0];

            if (!car) {
                return res.json({
                    message: 'Car not found!'
                });
            }

            var repairCost = moneyForRepair(car);

            if (req.user.money < repairCost) {
                return res.json({
                    message: 'You need more money'
                });
            }

            dataUsers.repairCar(req.user, car, repairCost)
                .then(function (success) {
                    res.redirect('/profile/cars');
                }, function (error) {
                    res.send(error);
                });

        },
        listCars: function (req, res) {

            for (var i = 0; i < req.user.cars.length; i += 1) {
                req.user.cars[i].costRepair = moneyForRepair(req.user.cars[i]);
            }

            res.render('profile-cars', {cars: req.user.cars});
        },
        userInfo: function (req, res) {
            res.render('profile', {info: req.user});
        }
    };
};