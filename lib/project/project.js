exports.Project = Project;

function Project (inputDirs) {
    this._inputDirs = inputDirs;
    this._modules = [];
    this._packages = [];
    this._index = {};
}

Project.prototype.addObjects = function (objects) {
    objects.modules.forEach(this.addModule, this);    
    objects.packages.forEach(this.addPackage, this);    
};

Project.prototype.addModule = function (module) {
    this._modules.push(module);
    this._index[module.description.name] = module;
};

Project.prototype.addPackage = function (package) {
    this._packages.push(package);
    this._index[package.description.name] = package;
};

Project.prototype.getObject = function (objectName) {
    return this._index[objectName];
};

Project.prototype.getModules = function () {
    return this._modules;
};

Project.prototype.getPackages = function () {
    return this._packages;
};

Project.prototype.getInputDirs = function () {
    return this._inputDirs;
};
