'use strict';

var maps = ['Map1', 'Map2', 'Map3', 'Map4', 'Map5', 'Map6', 'Map7', 'Map8', 'Map9', 'Map10', 'Map11', 'Map12', 'Map123'];

module.exports = {
    all: function (query) {
        var start = (query.page - 1) * query.size;
        var result = maps.slice(start, start + query.size);

        return {
            then: function (res, rej ) {
                res(result);
            }
        };
    }
};