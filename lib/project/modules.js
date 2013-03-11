var abc = require('abc');
var fs = require('fs');
var path = require('path');

var MODULES_DIR = 'modules';
var MODULE_FILE_NAME = 'module.js';

exports.load = function (project, callback) {
    var cachedModules = project.cacheManager.get('modules');
    if (!cachedModules) { // это первый запуск
        project.cacheManager.set('modules', cachedModules = {});
    }

    // ищем удаленные модули
    var modulesForDeleting = Object.keys(cachedModules).map(function (moduleName) {
        var object = project.objects.getObject(moduleName);
        return !(object && object.type === 'module');
    })
    // проверяем для каждого модуля аткуальность кеша для него
    abc.async.forEach(
        project.objects.getModules(),
        function (module) {
            var name = module.description.name;
            // данных в кеше может не быть, тогда первым параметром уйдет undefined
            module.setCacheData(cachedModules[name], project.changeManager, function (cacheIsValid) {
                if (!cacheIsValid) {
                    modulesForDeleting.push(name);
                    delete cachedModules[name];
                }
                callback();
            });
        },
        function () {
            removeModules(modulesForDeleting);
        }
    );
}

exports.save = function (project, callback) {
    abc.dir(path.join(project.dir, MODULES_DIR), function () {
        var cachedModules = project.cacheManager.get('modules');
        abc.async.forEach(
            project.objects.getModules(),
            function (module, callback) {
                var name = module.description.name;
                if (!cachedModules[name]) {
                    cachedModules[name] = module.getCacheData();
                    writeModule(project, module, callback);
                }
            },
            callback
        );
    });
}

function removeModules (project, modulesForDeleting, callback) {
    abc.async.forEach(
        modulesForDeleting,
        function (moduleName, callback) {
            fs.rmdir(path.join(project.dir, MODULES_DIR, moduleName), callback);
        },
        callback
    )
}

function writeModule (project, module, callback) {
    module.getSource(project.imageManager, function (source) {
        var moduleDir = path.join(project.dir, MODULES_DIR, module.description.name);
        abc.dir(moduleDir, function () {
            abc.file.write(path.join(moduleDir, MODULE_FILE_NAME), source, callback);
        })
    });
};