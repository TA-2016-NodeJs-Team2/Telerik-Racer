'use strict';

module.exports = function () {
    return {
        getAnswer: function (req, res) {
            var currentUser = req.app.locals.user;

            res.status(200);
            res.render('home',
                {
                    message: "Friendly message for users - sup' ninjas?",
                    auser: {
                        name: currentUser ? currentUser.username : undefined,
                        authorized: req.app.locals.user
                    }
                }
            );
        }
    };
};