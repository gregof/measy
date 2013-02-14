var abc = require('abc');
var modules = require('./modules.js');
var Objects = require('./objects/objects.js').Objects;
var Module = require('./module/module.js').Module;
var Package = require('./package/package.js').Package;
var cacheManagerModule = require('./managers/cache-manager.js');
var changeManagerModule = require('./managers/change-manager.js');
var imageManagerModule = require('./managers/image-manager.js');

exports.load = function (objects, projectDir, callback) {
    var project = createProject(projectDir);
    parseObjects(project, objects);
    abc.async.sequence(
        [
            function (callback) {
                abc.dir(projectDir, callback);
            },
            function (callback) {
                loadManagers(project, callback);
            },
            function (callback) {
                modules.load(project, callback);
            }
        ],
        function () {
            callback(project);
        }
    )
}

function createProject (projectDir) {
    return {
        dir: projectDir,
        rootDirs: [],
        objects: new Objects(),
        cacheManager: null,
        changeManager: null,
        imageManager: null
    };
}

function parseObjects (project, objects) {
    var rootDirsIndex = {};
    objects.forEach(function (object) {
        rootDirsIndex[object.root] = true;
        if (object.type === 'module') {
            project.objects.addModule(new Module(object.root, object.subDir, object.description));
        } else if (object.type === 'package') {
            project.objects.addPackage(new Package(object.root, object.subDir, object.description));
        } else {
            throw new Error('Unknow object type "' + object.type + '"');
        }
    });
    project.rootDirs = Object.keys(rootDirsIndex);
}

function loadManagers (project, callback) {
    abc.async.forEach(
        [
            function (callback) {
                cacheManagerModule.load(project.dir, function (cacheManager) {
                    project.cacheManager = cacheManager;
                    callback();
                });
            },
            function (callback) {
                changeManagerModule.load(project.rootDirs, function (changeManager) {
                    project.changeManager = changeManager;
                    callback();
                });
            },
            function (callback) {
                imageManagerModule.load(project.dir, function (imageManager) {
                    project.imageManager = imageManager;
                    callback();
                });
            }
        ],
        callback
    );
}