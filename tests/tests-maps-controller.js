/*globals describe, before, it, assert*/

var fakeData = require('./fake-data');
var sinon = require('sinon');
var mapsController = require('../server/controllers/maps-controller')(fakeData);

describe('Maps controller test', function () {
    'use strict';

    it('should return rendered form', function (done) {

        var expectedValue = 'map-views/map-add';
        var res = {
            render: function (viewPath) {
                return viewPath;
            }
        };

        var result = mapsController.addForm(null, res);
        assert.equal(result, expectedValue);
        done();
    });

    it('should return filtered maps by page and size', function (done) {

        var res = {
            render: function (path, config) {
                sinon.assert.pass(path==='map-views/maps');
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
        done(); // call done() after tests !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
    });
});