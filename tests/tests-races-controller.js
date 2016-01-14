/*globals describe, before, it, assert*/

var racesData = require('./mock-races');
var mapsData = require('./mock-maps');
var carsData = require('./mock-cars');
var usersData = require('./mock-users');
var sinon = require('sinon');
var racesController = require('../server/controllers/race-controller')(racesData, carsData, mapsData, usersData);

describe('Races controller test', function () {
    'use strict';

    //1
    it('should return rendered form', function (done) {

        var expectedValue = 'race-views/races-add';
        var res = {
            render: function (viewPath) {
                assert.equal(viewPath, expectedValue);

                return viewPath;
            },
            status: function (status) {
                return status;
            }
        };

        var result = racesController.createRaceRender({
            app : {
                locals:{
                    user: {
                        username: "TestUser"
                    }
                }
            }
    }, res);

        done();
    });

    //2
    it('should return redirect because of not authorised user - route for adding a race, view part', function (done) {

        var expectedValue = '/api/users/login';
        var returnedRedirect;
        var res = {
            redirect: function (pathFromRedirect) {
                returnedRedirect = pathFromRedirect;
                return pathFromRedirect;
            },
            status: function (status) {
                return status;
            }
        };


        var result = racesController.createRaceRender({
            app : {
                locals:{
                    user: undefined
                }
            }
        }, res);

        assert.equal(returnedRedirect, expectedValue);
        done();
    });

    //3
    it('should return redirect because of not authorised user -  - route for adding a race, logic part', function (done) {

        var expectedValue = '/api/users/login';
        var returnedRedirect;
        var res = {
            redirect: function (pathFromRedirect) {
                returnedRedirect = pathFromRedirect;
                return pathFromRedirect;
            },
            status: function (status) {
                return status;
            }
        };


        var result = racesController.createRaceAction({
            app : {
                locals:{
                    user: undefined
                }
            }
        }, res);

        assert.equal(returnedRedirect, expectedValue);
        done();
    });

    //4
    it('should refresh when missing data - route for adding a race, logic part', function (done) {

        var expectedValue = 'referer';
        var returnedRedirect;
        var res = {
            redirect: function (pathFromRedirect) {
                returnedRedirect = pathFromRedirect;
                return pathFromRedirect;
            }
        };


        var result = racesController.createRaceAction({
            app : {
                locals:{
                    user: {}
                }
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);

        assert.equal(returnedRedirect, expectedValue);
        done();
    });

    //5
    it('should add a race - route for adding a race, logic part', function (done) {

        var expectedValue = '/races/123';
        var returnedRedirect = '';
        var res = {
            redirect: function (pathFromRedirect) {
                returnedRedirect = pathFromRedirect;
                assert.equal(returnedRedirect, expectedValue);
                return pathFromRedirect;
            },
            status: function(status){
                return status;
            }
        };


        var result = racesController.createRaceAction({
            app : {
                locals:{
                    user: {}
                }
            },
            body: {
                car: "Test car",
                map: "Test map"
            }
        }, res);


        done();
    });

    //6
    it('should return rendered form - specific race', function (done) {

        var expectedValue = 'race-views/races-detailed';
        var res = {
            render: function (viewPath) {
                assert.equal(viewPath, expectedValue);
                return viewPath;
            },
            status: function(status){
                return status;
            }
        };

        var result = racesController.specificRender({
            app : {
                locals:{
                    user: {
                        username: "TestUser"
                    }
                }
            },
            params:{
                id : '123'
            }
        }, res);


        done();
    });

    //7
    it('should NOT join your own race', function (done) {

        var expectedValue = 'referer';
        var res = {
            redirect: function (pathFromRedirect) {
                assert.equal(pathFromRedirect, expectedValue);
                return pathFromRedirect;
            },
        };

        var result = racesController.joinRace({
            app : {
                locals:{
                    user: {
                        username: "TestUser"
                    }
                }
            },
            params:{
                id : '123'
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);


        done();
    });

    //8
    it('must provide a car in order to join race', function (done) {

        var expectedValue = 'referer';
        var res = {
            redirect: function (pathFromRedirect) {
                assert.equal(pathFromRedirect, expectedValue);
                return pathFromRedirect;
            },
        };

        var result = racesController.joinRace({
            app : {
                locals:{
                    user: {
                        username: "TestWithDifferentName"
                    }
                }
            },
            body:{
                car: ''
            },
            params:{
                id : '123'
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);


        done();
    });

    //8
    it('it should be able to join race', function (done) {

        var expectedValue = '123';
        var res = {
            redirect: function (pathFromRedirect) {
                assert.equal(pathFromRedirect, expectedValue);
                return pathFromRedirect;
            },
        };

        var result = racesController.joinRace({
            app : {
                locals:{
                    user: {
                        username: "TestWithDifferentName"
                    }
                }
            },
            body:{
                car: 'Some car'
            },
            params:{
                id : '123'
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);


        done();
    });

    //9
    it('it should NOT start someone elses race', function (done) {

        var expectedValue = 'referer';
        var res = {
            redirect: function (pathFromRedirect) {
                assert.equal(pathFromRedirect, expectedValue);
                return pathFromRedirect;
            },
            status: function(status){
                return status;
            }
        };

        var result = racesController.startRace({
            app : {
                locals:{
                    user: {
                        username: "TestWithDifferentName"
                    }
                }
            },
            body:{
                car: 'Some car'
            },
            params:{
                id : '123'
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);


        done();
    });

    //10
    it('it should NOT start your race without opponents', function (done) {

        var expectedValue = 'referer';
        var res = {
            redirect: function (pathFromRedirect) {
                assert.equal(pathFromRedirect, expectedValue);
                return pathFromRedirect;
            },
            status: function(status){
                return status;
            }
        };

        var result = racesController.startRace({
            app : {
                locals:{
                    user: {
                        username: "TestCreator"
                    }
                }
            },
            body:{
                car: 'Some car'
            },
            params:{
                id : '123'
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);


        done();
    });

    //10
    it('it should race when all data is there', function (done) {

        var expectedValue = '300';

        var res = {
            redirect: function (pathFromRedirect) {
                return pathFromRedirect;
            },
            status: function(status){
                assert.equal(status, expectedValue);
                return status;
            }

        };


        var result = racesController.startRace({
            app : {
                locals:{
                    user: {
                        username: "TestCreator"
                    }
                }
            },
            body:{
                car: 'Some car'
            },
            params:{
                id : '124'
            },
            get : function(askedValue){
                return askedValue;
            }
        }, res);
        done();
    });
});