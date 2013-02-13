var abc = require('abc');
var path = require('path');
var fs = require('fs');

var CACHE_DIR = '.m-out';
var CACHE_FILE = 'data.json';

exports.load = function (outpudDir, callback) {
    abc.dir(path.join(outpudDir, CACHE_DIR), function () {
        fs.exists(path.join(outpudDir, CACHE_DIR, CACHE_FILE), function (exists) {
            if (exists) {
                abc.file.read(path.join(outpudDir, CACHE_DIR, CACHE_FILE), function (text) {
                    console.log('Loaded ' + path.join(outpudDir, CACHE_DIR, CACHE_FILE));
                    callback(new CacheManager(JSON.parse(text)));
                })
            } else {
                console.log('Not found ' + path.join(outpudDir, CACHE_DIR, CACHE_FILE));
                callback(new CacheManager({}));
            }
        })
    })
}

exports.save = function (outpudDir, cache, callback) {
    abc.dir(path.join(outpudDir, CACHE_DIR), function () {
        console.log('Save ' + path.join(outpudDir, CACHE_DIR, CACHE_FILE));
        abc.file.write(path.join(outpudDir, CACHE_DIR, CACHE_FILE), cache.toString(), callback)
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