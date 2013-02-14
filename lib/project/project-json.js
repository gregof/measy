var abc = require('abc');
var path = require('path');

var PROJECT_JSON_FILE_NAME = 'project.json';

exports.save = function (project, callback) {
    var projectIndex = {
        packages: [],
        modules: []
    };

    var genAlias = makeAliasGenerator();
    /* 
     Каждому модулю приписывает алиас, уникальный в рамках текущей сборки проекта.
     Сначала расставляем алиасы модулям, потом пакетам. Делаем это для того чтобы было легче
     генерировать патроны при стрельбах - просто предполагаем, что первые n алиасов принадлежат модулям.
    */
    abc.async.sequence(
        [
            function (callback) {
                abc.async.forEach(
                    project.objects.getModules(),
                    function (module, callback) {
                        var moduleJson = {
                            'name': module.description.name,
                            'alias': genAlias(),
                            'type': module.description.type || 'js'
                        };
                        if (module.description.depends) {
                            moduleJson.depends = module.description.depends;
                        }
                        projectIndex.modules.push(moduleJson);
                        callback();
                    },
                    callback
                );
            },
            function (callback) {
                abc.async.forEach(
                    project.objects.getPackages(),
                    function (package, callback) {
                        projectIndex.packages.push({
                            'name': package.description.name, 
                            'alias': genAlias(),
                            'depends': package.description.depends
                        });
                        callback();
                    },
                    callback
                );
            }
        ],
        function () {
            console.log('Write ' + path.join(project.dir, PROJECT_JSON_FILE_NAME))
            console.log(JSON.stringify(projectIndex, null, '  '))
            abc.file.write(
                path.join(project.dir, PROJECT_JSON_FILE_NAME),
                JSON.stringify(projectIndex, null, '  '),
                callback
            );
        }
    );
}

function makeAliasGenerator (project, callback) {
    var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var alphabetSize = alphabet.length;
    var counter = -1;
    return function () {
        counter++;
        return alphabet[Math.floor(counter / alphabetSize)] + alphabet[counter % alphabetSize];
    };
};