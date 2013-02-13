var abc = require('abc');
var path = require('path');

var MODULES_DIR = 'modules';
var MODULE_FILE_NAME = 'module.js';

exports.write = function (project, outpudDir, callback) {
    loadModules(project, function () {
        writeModules(project, outpudDir, callback);
    })
}

function loadModules (project, callback) {
    abc.async.forEach(
        project.getModules(),
        loadModule,
        function () {
            callback();
        }
    );
}

function loadModule (module, callback) {
    var sourceTextArray = [];
    abc.async.forEach(
        module.description.src,
        function (src, callback) {
            console.log('Read file ' + path.join(module.root, module.subDir, src))
            abc.file.read(path.join(module.root, module.subDir, src), function (text) {
                sourceTextArray.push(text);
                callback();
            })
        },
        function () {
            module.source = sourceTextArray.join('');
            callback();
        }
    );
}

function writeModules (project, outpudDir, callback) {
    abc.dir(path.join(outpudDir, MODULES_DIR), function () {
        abc.async.forEach(
            project.getModules(),
            function (module, callback) {
                writeModule(module, outpudDir, callback)
            },
            function () {
                callback();
            }
        );
    });
}

function writeModule (module, outpudDir, callback) {
    var moduleDir = path.join(outpudDir, MODULES_DIR, module.description.name);
    abc.dir(moduleDir, function () {
        abc.file.write(path.join(moduleDir, MODULE_FILE_NAME), module.source, callback)
    })
}