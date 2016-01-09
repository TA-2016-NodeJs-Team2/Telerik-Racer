'use strict';

module.exports = function () {
    return {
        getAnswer: function(req, res){
            res.status(200);
            res.render('home', {message: "Friendly message for users - sup' ninjas?"});
        }
    };
};