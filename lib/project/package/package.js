exports.Package = Package;

function Package (root, subDir, description) {
    this.root = root;
    this.subDir = subDir;
    this.description = this._normalizeDescription(description);
}

Package.prototype.baseType = 'package';

Package.prototype._normalizeDescription = function (description) {
    if (!description.name) {
        throw new Error('Empty \'name\'!');
    }

    if (!description.depends.length) {
        throw new Error('Empty \'depends\' in package ' + description.name);
    }

    return description;
};
