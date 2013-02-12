var abc = require('abc');
var path = require('path');
var fs = require('fs');

var CACHE_DIR = '.m-out';
var CACHE_FILE = 'data.json';

exports.load = function (buildDir, callback) {
    abc.dir(path.join(buildDir, CACHE_DIR), function () {
        fs.exists(path.join(buildDir, CACHE_DIR, CACHE_FILE), function (exists) {
            if (exists) {
                abc.file.read(path.join(buildDir, CACHE_DIR, CACHE_FILE), function (text) {
                    callback(new CacheManager(JSON.parse(text)));
                })
            } else {
                callback(new CacheManager({}));
            }
        })
    })
}

exports.save = function (buildDir, cache, callback) {
    abc.dir(path.join(buildDir, CACHE_DIR), function () {
        abc.file.write(path.join(buildDir, CACHE_DIR, CACHE_FILE), cache.toString(), callback)
    })
}

function CacheManager (data) {
    this._data = data;
}

CacheManager.prototype.get = function (key) {
    return this._data[key];
};

CacheManager.prototype.set = function (key, value) {
    this._data[key] = value;
};

CacheManager.prototype.toString = function() {
    return JSON.stringify(this._data, null, '  ');
};