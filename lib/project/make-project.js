var abc = require('abc');
var findObjects = require('./find-objects.js').find;
var Project = require('./project.js').Project;

exports.make = function (inputDirs, callback) {
    var project = new Project();
    abc.async.forEach(
        inputDirs,
        function (inputDir, callback) {
            findObjects(inputDir, function (objects) {
                project.addObjects(objects);
                callback();
            })
        },
        function () {
            callback(project);
        }
    );
}