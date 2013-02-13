var abc = require('abc');
var path = require('path');

var generateAliasesModule = require('./generate-aliases.js');
var cacheManagerModule = require('./cache-manager.js');
var changeManagerModule = require('./change-manager.js');
var imageManagerModule = require('./image-manager.js')

exports.build = function (project, outpudDir, options, callback) {
    if (!callback) {
        callback = function () {};
    }

    abc.dir(outpudDir, function () {

        var cacheManager = null;
        var changeManager = null;
        var imageManager = null;

        abc.async.forEach(
            [
                function (callback) {
                    generateAliasesModule.generate(project, callback)
                },
                function (callback) {
                    cacheManagerModule.load(outpudDir, function (_cacheManager) {
                        cacheManager = _cacheManager;
                        callback();
                    })
                },
                function (callback) {
                    changeManagerModule.load(project.getInputDirs(), function (_changeManager) {
                        changeManager = _changeManager;
                        callback();
                    })
                },
                function (callback) {
                    imageManagerModule.load(outpudDir, function (_imageManager) {
                        imageManager = _imageManager;
                        callback();
                    })
                }
            ],
            function () {
                write(project, outpudDir, callback);
            }
        );
    })
}

function write (project, outpudDir, callback) {
    abc.async.forEach(
        [
            function (callback) {
                require('./modules.js').write(project, outpudDir, callback);
            },
            function (callback) {
                require('./project-json.js').write(project, outpudDir, callback);
            }
        ],
        callback
    );
}