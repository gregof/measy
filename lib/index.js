var abc = require('abc');

exports.findObjects = function (inputDirs, callback) {
    require('./find-objects.js').find(inputDirs, callback)
};

exports.loadProject = function (objects, projectDir, options, callback) {
    require('./project/load-project.js').load(objects, projectDir, options, callback);
};

exports.saveProject = function (project, options, callback) {
    require('./project/save-project.js').load(project, options, callback);
};