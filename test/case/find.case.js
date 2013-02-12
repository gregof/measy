//in
var Project = require(tc.fixPath('./../../lib/project/project.js')).Project;
var prj = new Project();
prj.findInDir(tc.fixPath('../src'), function (objects) {
    console.log(JSON.stringify(objects));
    tc.out(objects.length);
    tc.finish();
});
//out
3