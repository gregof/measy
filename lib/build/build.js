var abc = require('abc');

var cacheManager = require('./cache-manager.js');
var generateAliases = require('./generate-aliases.js').generate;

exports.build = function (project, outpudDir, options, callback) {
    abc.dir(outpudDir, function () {
        var cache = null;
        abc.async.forEach(
            [
                function (callback) {
                    generateAliases(project, callback)
                },
                function (callback) {
                    cacheManager.load(outpudDir, function (_cache) {
                        cache = _cache;
                        callback();
                    })
                }
            ],
            function () {
                console.log(JSON.stringify(project._index, null, '  '));
            }
        );
    })
}