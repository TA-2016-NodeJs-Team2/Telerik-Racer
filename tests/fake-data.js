'use strict';

var maps = ['Map1', 'Map2', 'Map3', 'Map4', 'Map5', 'Map6', 'Map7', 'Map8', 'Map9', 'Map10', 'Map11', 'Map12', 'Map123'];

module.exports = {
    all: function (query) {
        var start = (query.page - 1) * query.size;
        var result = maps.slice(start, start + query.size);

        return {
            then: function (res, rej) {
                res(result);
            }
        };
    },
    details: function (id) {
        return {
            then: function (res, rej) {
                if (id.includes('9')) {
                    return res({
                        name: 'Detailed Map'
                    });
                }
                rej({
                    status: 404,
                    message: 'Not found'
                });
            }
        };
    },
    save: function (map) {
        return {
            then: function (res, rej) {
                map._id = 'ADF2354F4CADF2354F4CADF2354F4C';
                res(map);
            }
        };
    },
    remove: function (id) {
        return {
            then: function (res, rej) {
                if (id[0] === 'B') {

                return res({
                    message: 'Done!'
                });
                }
                rej({
                    status: 400,
                    message: 'Cannot remove map'
                });
            }
        };
    }
};