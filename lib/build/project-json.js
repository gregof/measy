var abc = require('abc');
var path = require('path');

var PROJECT_JSON_FILE_NAME = 'project.json';

exports.write = function (project, outpudDir, callback) {
    var projectIndex = {
        packages: [],
        modules: {
            css: [],
            js: []
        }
    };

    abc.async.forEach(
        [
            function (callback) {
                abc.async.forEach(
                    project.getModules(),
                    function (module, callback) {
                        var moduleJson = {
                            'name': module.description.name,
                            'alias': module.alias
                        };
                        if (module.description.depends) {
                            moduleJson.depends = module.description.depends;
                        }
                        if (!module.description.type || module.description.type === 'js') {
                            projectIndex.modules.js.push(moduleJson);
                        } else if (module.description.type === 'css') {
                            projectIndex.modules.css.push(moduleJson);
                        }
                        callback();
                    },
                    function () {
                        callback();
                    }
                );
            },
            function (callback) {
                abc.async.forEach(
                    project.getPackages(),
                    function (package, callback) {
                        projectIndex.packages.push({
                            'name': package.description.name, 
                            'depends': package.description.depends,
                            'alias': package.alias
                        });
                        callback();
                    },
                    function () {
                        callback();
                    }
                );
            }
        ],
        function () {
            console.log('Write ' + path.join(outpudDir, PROJECT_JSON_FILE_NAME))
            console.log(JSON.stringify(projectIndex, null, '  '))
            abc.file.write(path.join(outpudDir, PROJECT_JSON_FILE_NAME), JSON.stringify(projectIndex, null, '  '), callback);
        }
    );
}