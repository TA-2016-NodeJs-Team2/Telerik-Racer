'use strict';
var BBPromise = require('bluebird');

module.exports = {

    details: function (theUser) {
        theUser = {
            money : 20,
            respect : 0,
            save: function(){

            }
        }
        return new BBPromise(function (resolve, reject) {
            resolve(theUser);
        });
    },

};