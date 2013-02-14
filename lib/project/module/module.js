var abc = require('abc');
var path = require('path');

exports.Module = Module;

function Module (root, subDir, description) {
    this.root = root;
    this.subDir = subDir;
    this.description = description;
    this._data = {
        src: description.src
    };
    this._source = null;
}

Module.prototype.type = 'module';

Module.prototype.load = function (cacheData, changeManager, callback) {
    // проверяем что кеш для того же состояния description и исходные код, используемые изображения 
    // и файл с внешним описанием зивисимостей (если есть) не изменились
    if (cacheData && this._checkCache(cacheData, changeManager)) {
        console.log('Module "' + this.description.name + '" loaded from cache.')
        // сохраняем данные из кеша
        this._data = cacheData;
        callback(true);
    } else {
        var _this = this;
        // грузим исходный код и парсим его
        this.getSource(function (source) {
            console.log('Module "' + _this.description.name + '" loaded from disk.')
            _this._parseSource();
            callback(false);
        })
    }
};

Module.prototype._checkCache = function (cacheData, changeManager) {
    var equal = cacheData.src.every(function (src, i) {
        // список исходных файлов совпадает
        return this._data.src[i] === src && 
            // и файлы не изменились
            changeManager.getFileStatus(this.root, path.join(this.subDir, src)) === '-';
    }, this);
    return equal;
};

Module.prototype.getCacheData = function () {
    return this._data;
};

Module.prototype.getSource = function (callback) {
    if (this._source) {
        callback(this._source);
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
            _this._source = sourceTextArray.join('');
            callback(_this._source);
        }
    );    
};

Module.prototype._parseSource = function (source) {
    
};

Module.prototype.getProvides = function () {
    
};

Module.prototype.getUsedImports = function () {
    
};