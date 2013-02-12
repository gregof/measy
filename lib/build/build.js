var abc = require('abc');

var generateAliases = require('./generate-aliases.js').generate;
var cacheManagerModule = require('./cache-manager.js');
var changeManagerModule = require('./change-manager.js')

exports.build = function (project, outpudDir, options, callback) {
    abc.dir(outpudDir, function () {

        var cache = null;
        var changeManager = null;

        abc.async.forEach(
            [
                function (callback) {
                    generateAliases(project, callback)
                },
                function (callback) {
                    cacheManagerModule.load(outpudDir, function (_cache) {
                        cache = _cache;
                        callback();
                    })
                },
                function (callback) {
                    changeManagerModule.load(project.getInputDirs(), function (_changeManager) {
                        changeManager = _changeManager;
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