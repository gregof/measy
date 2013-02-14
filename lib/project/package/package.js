exports.Package = Package;

function Package (root, subDir, description) {
    this.root = root;
    this.subDir = subDir;
    this.description = description;
}

Package.prototype.type = 'module';