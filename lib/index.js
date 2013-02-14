var abc = require('abc');

exports.findObjects = function (inputDirs, callback) {
    require('./find-objects.js').find(inputDirs, callback)
};

exports.loadProject = function (objects, projectDir, callback) {
    require('./project/load.js').load(objects, projectDir, callback);
};

exports.saveProject = function (project, callback) {
    require('./project/save.js').save(project, callback);
};