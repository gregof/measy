var abc = require('abc');

exports.makeProject = function (inputDirs, callback) {
    require('./project/make-project.js').make(inputDirs, callback)
};

exports.build = function (project, outputDir, modes, callback) {
    require('./build/build.js').build(project, outputDir, modes, callback);
};