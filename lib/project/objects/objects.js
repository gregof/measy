exports.Objects = Objects;

function Objects () {
    this._modules = [];
    this._packages = [];
    this._index = {};
}

Objects.prototype.addModule = function (module) {
    this._modules.push(module);
    this._index[module.description.name] = module;
};

Objects.prototype.addPackage = function (package) {
    this._packages.push(package);
    this._index[package.description.name] = package;
};

Objects.prototype.getObject = function (objectName) {
    return this._index[objectName];
};

Objects.prototype.getModules = function () {
    return this._modules;
};

Objects.prototype.getPackages = function () {
    return this._packages;
};