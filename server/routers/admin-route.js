'use strict';

var express = require('express'),
    router = express.Router(),
    passport = require('passport');

// middleware
router.use(function (req, res, next) {
    // TODO: Global constant for roles
    if (req.user.role === 'administrator') {

        // set header in middleware
        req.headers['X-AdminAuth'] ='whatEver';
        next();
        return;
    }

    // TODO: implement some route
    res.redirect('/login');
});

router.get('/', function (req, res) {
    // should render some view

    // get header that was set in middleware
    if (!(req.headers['X-AdminAuth'])) {
    	res.redirect('/login');
        return;
    }

    console.log(req.headers);
   res.send('Administrator view');
});

module.exports = function (app) {
    app.use('/api/admin/', passport.authenticate('bearer',{
        session: false
    }) , router);
};

