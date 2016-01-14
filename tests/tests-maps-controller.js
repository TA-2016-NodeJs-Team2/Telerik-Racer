/*globals describe, before, it, assert, afterEach*/

var fakeData = require('./fake-data');
var sinon = require('sinon');
var chai = require('chai');
var mocha = require('mocha');
//var expect =  require('mochca').expect;

var fakeNotifier = {
    countCalled: 0,
    notify: function (config) {
        "use strict";

        this.countCalled += 1;
    }
};
sinon.stub(fakeNotifier, 'notify');

var mapsController = require('../server/controllers/maps-controller')(fakeData, fakeNotifier);

describe('Maps controller test', function () {
    'use strict';
    describe('Get requests', function () {

        it('should return rendered form', function (done) {

            var expectedValue = 'map-views/map-add';
            var res = {
                render: function (viewPath) {
                    return viewPath;
                }
            };

            var result = mapsController.addForm(null, res);
            chai.assert.equal(result, expectedValue);
            done();
        });

        it('should return filtered maps by page and size', function (done) {

            var res = {
                render: function (path, config) {
                    sinon.assert.pass(path === 'map-views/maps');
                    sinon.assert.pass(config.maps.length === 10);
                }
            };

            mapsController.getAll({
                query: {
                    page: 1,
                    size: 10
                }
            }, res);

            sinon.assert.pass(res.render.calledOnce);
            done();
        });

        it('should return filtered maps from page 2', function (done) {
            var res = {
                render: function (path, config) {
                    chai.expect(config).to.has.property('query');
                    chai.expect(config.maps.length).to.equal(5);
                }
            };

            mapsController.getAll({
                query: {
                    page: 2,
                    size: 5
                }
            }, res);

            sinon.assert.pass(res.render.calledOnce);
            done();
        });

        it('should redirect to /maps/all when bad is passed in url', function (done) {
            var res = {
                status: function (status) {
                    return this;
                },
                redirect: function (path) {
                    chai.expect(path).to.equal('/maps/all');
                }
            };

            var wrongIds = ['23badID', '-12Sacc1231', '  ', '32133121211111PO'];

            for (var i = 0; i < wrongIds.length; i += 1) {
                mapsController.getDetails({
                    params: {
                        id: wrongIds[i]
                    }
                }, res);
            }
            sinon.assert.pass(fakeNotifier.countCalled === wrongIds.length);
            done();
        });

        it('should return object details', function (done) {

            var res = {
                render: function () {
                }
            };
            var req = {
                params: {
                    id: '123447584114221912437A23'
                }
            };

            sinon.stub(res, 'render');
            mapsController.getDetails(req, res);

            sinon.assert.calledWith(res.render, 'map-views/map-detail', {
                map: {
                    name: 'Detailed Map'
                }
            });

            done();
        });

        it('should call notify with not found message and redirect to /maps/all', function (done) {

            var res = {
                redirect: function () {
                },
                status: function (staus) {
                    return this;
                }
            };
            var req = {
                params: {
                    id: '123447584114221012437A23'
                }
            };

            sinon.stub(res, 'status').returns(res);
            sinon.stub(res, 'redirect');
            mapsController.getDetails(req, res);

            sinon.assert.pass(fakeNotifier.countCalled === 1);
            sinon.assert.calledWithMatch(fakeNotifier.notify, {message: 'Not found'});
            sinon.assert.calledWith(res.redirect, '/maps/all');
            sinon.assert.calledWith(res.status, 404);

            done();
        });

        afterEach(function () {
            fakeNotifier.countCalled = 0;
        });
    });
    describe('Post requests', function () {
        it('should redirect to /maps/add when body not provided', function (done) {
            var res = {
                redirect: sinon.spy(),
                status: function (status) {
                    return this;
                }
            };

            mapsController.add({}, res);

            sinon.assert.callCount(res.redirect, 1);
            sinon.assert.calledWith(res.redirect, '/maps/add');
            sinon.assert.pass(fakeNotifier.countCalled === 1);
            done();
        });



        it('should redirect to /maps/add when wrong/invalid data provided', function (done) {
            var res = {
                redirect: sinon.spy(),
                status: function (status) {
                    return this;
                }
            };

            var req = {
                body: {
                   prize1: 130,
                    prize2: 233,
                    prize3: 230,
                    prize4: 140,
                    prize5: 340,
                    name: 'Test Map',
                    respect1: 'invalid',
                    respect2: 123,
                    respect3: 23,
                    respect4: 23,
                    respect5: 14,
                    damageToTake: 300
                }
            };

            mapsController.add(req, res);

            sinon.assert.callCount(res.redirect, 1);
            sinon.assert.calledWith(res.redirect, '/maps/add');
            sinon.assert.pass(fakeNotifier.notify.calledBefore(res.redirect));
            sinon.assert.calledWithMatch(fakeNotifier.notify, {message : 'Prizes and respects should be 5 positive numbers!'});
            sinon.assert.pass(fakeNotifier.countCalled === 1);
            done();
        });

        afterEach(function () {
            fakeNotifier.countCalled = 0;
        });
    });
});