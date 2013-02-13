var fsa = require('fsa');
var abc = require('abc');

var CACHE_DIR = '.m-in'

exports.load = function (inputDirs, callback) {
    var changeManagers = {};
    abc.async.forEach(
        inputDirs,
        function (inputDir, callback) {
            var dirCache = new fsa.DirCache(inputDir, CACHE_DIR);
            dirCache.load(function (data, changeManager) {
                console.log('Loaded fsa.DirCache for ' + inputDir);
                changeManagers[inputDir] = changeManager;
                callback();
            });
        },
        function () {
            callback(new CommonChangeManager(changeManagers));
        }
    );
}

exports.save = function (inputDirs, callback) {
    abc.async.forEach(
        inputDirs,
        function (inputDir, callback) {
            var dirCache = new fsa.DirCache(inputDir, CACHE_DIR);
            console.log('Saved fsa.DirCache for ' + inputDir);
            dirCache.save(null, callback);
        },
        function () {
            callback();
        }
    );
}

function CommonChangeManager (changeManagers) {
    this._changeManagers = changeManagers;
}

CommonChangeManager.prototype.getFileStatus = function (dir, fileName) {
    return this._changeManagers[dir].getFileStatus(fileName);
};