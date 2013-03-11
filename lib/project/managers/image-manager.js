var path = require('path');
var crypto = require('crypto');
var abc = require('abc');

exports.load = function (outputDir, callback) {

    var images = {};
    var imageDir = path.join(outputDir, 'images');

    function processImage (imagePath, callback) {
        var normilizedSrc = path.normalize(imagePath);
        
        if (!images[normilizedSrc]) {
            images[normilizedSrc] = {callbacks: [callback]};

            abc.file.binRead(normilizedSrc, function (imageData) {
                var finalSrc = crypto.createHash('md5').update(imageData).digest('hex');
                abc.file.binWrite(path.join(imageDir, finalSrc), imageData, function () {
                    images[normilizedSrc].finalSrc = finalSrc;
                    images[normilizedSrc].callbacks.forEach(function (callback) {
                        callback(finalSrc);
                    });
                });
            });
        } else if (images[normilizedSrc].finalSrc) {
            callback(images[normilizedSrc].finalSrc);
        } else {
            images[normilizedSrc].callbacks.push(callback);
        }
    }

    abc.dir(imageDir, function () {
        callback({processImage: processImage});
    });
}

exports.save = function (outputDir, imageManager, callback) {
    callback()
}