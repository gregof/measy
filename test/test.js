var measy = require('./../lib');
measy.findObjects(
    ['src'],
    function (objects) {
        measy.loadProject(objects, 'build', function (project) {
            measy.saveProject(project, function () {
                console.log('done')
            })
        });
    }
);