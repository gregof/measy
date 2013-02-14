var abc = require('abc');
var flac = require('flac');
var path = require('path');

var CACHE_DIR = '.m-in';

exports.find = function (inputDirs, callback) {
    var objects = [];
    abc.async.forEach(
        inputDirs,
        function (dir, callback) {
            findInDir(dir, objects, callback)
        },
        function () {
            callback(objects);
        }
    );
}

function findInDir (dir, objects, callback) {
    abc.dir(path.join(dir, CACHE_DIR), function () {
        flac.find(
            dir, 
            {
                filters: [
                    {
                        name: 'module',
                        test: function (fileName) {
                            return fileName === 'module.json';
                        }
                    },
                    {
                        name: 'package',
                        test: function (fileName) {
                            return fileName === 'package.json';
                        }
                    }
                ],
                cacheDir: path.join(CACHE_DIR, '.flac')
            },
            function (files) {
                parseFiles(dir, files, objects, callback);
            }
        );
    });
}

/*
  files = [ {'filter': ..., 'file': ..., 'text': ... } ]
*/
function parseFiles (dir, files, objects, callback) {
    files.forEach(function (file) {
        objects.push({
            type: file.filter === 'module' ? 'module' : 'package',
            root: dir,
            subDir: path.dirname(file.file),
            description: JSON.parse(file.text)
        });
    });

    callback();
}