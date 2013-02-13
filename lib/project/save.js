var abc = require('abc');

var cacheManagerModule = require('./managers/cache-manager.js');
var changeManagerModule = require('./managers/change-manager.js');
var imageManagerModule = require('./managers/image-manager.js')

exports.save = function (project, callback) {
    abc.async.forEach(
        [
            function (callback) {
                cacheManagerModule.save(project.dir, project.cacheManager, callback);
            },
            function (callback) {
                changeManagerModule.save(project.rootDirs, callback);
            },
            function (callback) {
                imageManagerModule.save(project.dir, project.imageManager, callback)
            },
        ],
        function () {
            callback();
        }
    )
}