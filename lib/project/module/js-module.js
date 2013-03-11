exports.procesSource = function (sources, module, imageManager, callback) {
    var text = sources.map(function (source) {return source.text});

    if (module.description.images) {
        processImages(module, imageManager, function (images) {
            callback(wrapSource(text, images));
        });
    } else {
        callback(wrapSource(text));
    }   
}

function processImages (module, imageManager, callback) {
    var images = {};

    abc.async.forEach(
        Object.keys(module.description.images),
        function (imageName, callback) {
            module.addResource(module.description.images[imageName].src);
            imageManager.processImage(
                path.join(module.root, module.subDir, module.description.images[imageName].src),
                function (finalSrc) {
                    images[imageName] = finalSrc;
                    callback();
                }
            );
        },
        function () {
            callback(images);
        }
    );
}

function wrapSource (text, images) {
    return [
        'function (provide, imports, project) {\n',
        images ? getImages(images) : '',
        text,
        '\n}'
    ].join('');
};

function getImages (images) {
    var imgText = Object.keys(images).map(function (name) {
        return '\'' + name + '\':\'' + images[name] + '\''
    });
    return '\
    var images = new function () { \
       var images = {' + imgText.join(',') + '}; \
       return {get: function (imgName) {return project.IMAGE_PATH + images[imgName]}} \
    };\n';
}