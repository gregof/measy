var abc = require('abc');
var path = require('path');
var cssModule = require('./css-module.js');
var jsModule = require('./js-module.js');

exports.Module = Module;

function Module (root, subDir, description) {
    this.root = root;
    this.subDir = subDir;
    this.description = this._normalizeDescription(description);

    // данные по которым строится код модуля
    this._data = {
        description: this.description,
        // используемые ресурсы, сейчас это исходники и изображения
        resources: this.description.src
    };

    this._source = null;
}

Module.prototype.baseType = 'module';

Module.prototype._normalizeDescription = function (description) {
    if (!description.name) {
        throw new Error('Empty name!');
    }

    if (!description.src.length) {
        throw new Error('Empty \'src\' in module ' + description.name);
    }

    if (!description.type) {
        description.type = 'js';
    }

    if (!description.depends) {
        description.depends = [];
    }

    return description;
};

Module.prototype.addResource = function (resource) {
    this._data.resources.push(resource);
};

Module.prototype.setCacheData = function (cacheData, changeManager, callback) {
    // проверяем что кеш для того же состояния description и исходные кода, используемые изображения 
    // и файл с внешним описанием зивисимостей (если есть) не изменились
    if (cacheData && this._checkCache(cacheData, changeManager)) {
        console.log('Module "' + this.description.name + '" loaded from cache.')
        // сохраняем данные из кеша
        this._data = cacheData;
        callback(true);
    } else {
        callback(false);
    }
};

Module.prototype._checkCache = function (cacheData, changeManager) {
    // описание совпадает
    var equal = JSON.stringify(cacheData.description) === JSON.stringify(this.description);
    // используемые ресурсы не подверглись изменению
    if (equal) {
        equal = cacheData.resources.every(function (src) {
            return changeManager.getFileStatus(this.root, path.join(this.subDir, src)) === '-';         
        }, this);
    }

    return equal;
};

Module.prototype.getCacheData = function () {
    return this._data;
};

Module.prototype.getSource = function (imageManager, callback) {
    //TODO: collect callbacks

    if (this._source) {
        callback(this._source);
        return;
    }

    console.log('Module "' + this.description.name + '" loaded from disk.');

    var _this = this;
    var sources = [];
    abc.async.forEach(
        _this.description.src,
        function (src, callback) {
            var filePath = path.join(_this.root, _this.subDir, src); 
            console.log('Read file ' + path.join(_this.root, _this.subDir, src))
            abc.file.read(filePath, function (text) {
                sources.push({text: text, src: src});
                callback();                    
            })
        },
        function () {
            _this._processSources(sources, imageManager, function (text) {
                _this._source = text;
                callback(_this._source);                
            })
        }
    );    
};

Module.prototype._processSources = function (sources, imageManager, callback) {
    if (this.description.type === 'js') {
        jsModule.procesSource(sources, this, imageManager, callback);
    } else if (this.description.type === 'css') {
        cssModule.procesSource(sources, this, imageManager, callback);
    }
}