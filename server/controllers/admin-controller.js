module.exports = function (data) {
    "use strict";
    return {
        all: function (req, res) {
            data.all(req.query)
                .then(function (response) {
                    res.json(response);
                }, function (err) {
                    res.status(400)
                        .json({
                            message: err.message
                        });
                });
        },
        details: function (req, res) {
            data.details(req.params.id)
                .then(function (user) {
                res.json(user);
            }, function (err) {
                res.status(400)
                    .json({
                        message: err.message
                    });
            });
        },
        deleteUser: function (req, res, next) {
            if (!(req.params.id)) {
                res.status(400)
                    .json({
                        message: 'you should provide an ID!'
                    });
                return;
            }

            // authenticated User
            var user = req.user;

            data.remove(req.params.id)
                .then(function (data) {
                    res.json(data);
                }, function (err) {
                    res.status(400)
                        .json({
                            message: err.message
                        });
                });
        }
    };
};