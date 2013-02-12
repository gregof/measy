var abc = require('abc');
var path = require('path');
var fs = require('fs');

var CACHE_DIR = '.measy';
var CACHE_FILE = 'data.json';

exports.load = function (buildDir, callback) {
    abc.dir(path.join(buildDir, CACHE_DIR), function () {
        fs.exists(path.join(buildDir, CACHE_DIR, CACHE_FILE), function (exists) {
            if (exists) {
                abc.file.read(path.join(buildDir, CACHE_DIR, CACHE_FILE), function (text) {
                    callback(new Cache(JSON.parse(text)));
                })
            } else {
                callback(new Cache({}));
            }
        })
    })
}

exports.save = function (buildDir, cache, callback) {
    abc.dir(path.join(buildDir, CACHE_DIR), function () {
        abc.file.write(path.join(buildDir, CACHE_DIR, CACHE_FILE), cache.toString(), callback)
    })
}

function Cache (data) {
    this._data = data;
}

Cache.prototype.get = function (key) {
    return this._data[key];
};

Cache.prototype.set = function (key, value) {
    this._data[key] = value;
};

Cache.prototype.toString = function() {
    return JSON.stringify(this._data, null, '  ');
};