var flac = require('flac');
var path = require('path');

exports.find = function (dir, callback) {
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
            ]
        },
        function (files) {
            parseFiles(dir, files, callback);
        }
    );
}

/*
  files = [ {'filter': ..., 'file': ..., 'text': ... } ]
*/
function parseFiles (dir, files, callback) {
    var objects = {
        modules: [],
        packages: []
    }
    
    files.forEach(function (file) {
        (file.filter === 'module' ? objects.modules : objects.packages).push({
            root: dir,
            subDir: path.dirname(file.file),
            description: JSON.parse(file.text)
        });
    });

    callback(objects);
}