var Objects = require('./objects/objects.js').Objects;
var Module = require('./module/module.js').Module;
var Package = require('./package/package.js').Package;

var cacheManagerModule = require('./managers/cache-manager.js');
var changeManagerModule = require('./managers/change-manager.js');
var imageManagerModule = require('./managers/image-manager.js')

exports.load = function (objects, projectDir, callback) {
    var project = {
        dir: projectDir,
        rootDirs: [],
        objects: new Objects(),
        cacheManager: null,
        changeManager: null,
        imageManager: null
    };

    var rootDirsIndex = {};
    objects.forEach(function (object) {
        rootDirsIndex[object.root] = true;
        if (object.type === 'module') {
            project.objects.addModule(new Module(object.root, object.subDir, object.description));
        } else if (object.type === 'package') {
            project.objects.addPackage(new Package(object.root, object.subDir, object.description)));
        } else {
            throw new Error('Unknow object type "' + object.type + '"');
        }
    });
    project.rootDirs = rootDirsIndex.key();

    abc.async.forEach(
        [
            function (callback) {
                cacheManagerModule.load(projectDir, function (cacheManager) {
                    project.cacheManager = _cacheManager;
                    callback();
                })
            },
            function (callback) {
                changeManagerModule.load(project.rootDirs, function (changeManager) {
                    project.changeManager = _changeManager;
                    callback();
                })
            },
            function (callback) {
                imageManagerModule.load(projectDir, function (imageManager) {
                    project.imageManager = _imageManager;
                    callback();
                })
            }
        ],
        function () {
            callback(project);
        }
    );
}