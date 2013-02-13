var abc = require('abc');
var path = require('path');

var MODULES_DIR = 'modules';
var MODULE_FILE_NAME = 'module.js';

exports.Module = Module;

function Module (root, subDir, description) {
    this.root = root;
    this.subDir = subDir;
    this.description = description;
    this._data = {};
}

Module.prototype.setCacheData = function (cacheData, changeManager, callback) {
    // проверяем что кеш для того же состояния description и исходные код, используемые изображения 
    // и файл с внешним описанием зивисимостей (если есть) не изменились
    callback(false);
};

Module.prototype.getCacheData = function () {

};

Module.prototype.getSource = function (callback) {
    if (this._data.source) {
        callback(this._data.source);
        return;
    }

    var _this = this;
    var sourceTextArray = [];
    abc.async.forEach(
        _this.description.src,
        function (src, callback) {
            console.log('Read file ' + path.join(_this.root, _this.subDir, src))
            abc.file.read(path.join(_this.root, _this.subDir, src), function (text) {
                sourceTextArray.push(text);
                callback();
            })
        },
        function () {
            _this._data.source = sourceTextArray.join('');
            callback(_this._data.source);
        }
    );    
};

Module.prototype.getDepends = function (callback) {
    
};

Module.prototype.getProvides = function (callback) {
    
};

Module.prototype.getUsedImports = function (callback) {
    
};

Module.prototype.save = function (outputDir, minify, callback) {
    // TODO: если мы не смогли принять кеш, то переписываем
    var moduleDir = path.join(outpudDir, MODULES_DIR, module.description.name);
    abc.dir(moduleDir, function () {
        abc.file.write(path.join(moduleDir, MODULE_FILE_NAME), module._data.source, callback);
    })
};