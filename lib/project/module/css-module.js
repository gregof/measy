var path = require('path');
var abc = require('abc');

exports.procesSource = function (sources, module, imageManager, callback) {
    var texts = [];
    abc.async.forEach(
        sources,
        function (source, callback) {
            processFile(source.text, source.file, module, imageManager, function (text) {
                texts.push(text);
                callback();
            })
        },
        function () {
            callback(wrapSource(texts.join('')));
        }
    );
}

function processFile (source, module, imageManager, callback) {
    var cssText = source.text;
    var images = [];

    // v\: * { behavior:url(#default#VML); display:inline-block }
    // background: url("http://yandex.st/some.png");    
    // background: url("../images/balloon.png");
    // background: url("../images/tail.png") top left no-repeat;
    // -background: url("../images/tail.png") top left no-repeat;
    // -filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="../images/close-button.png", sizingMethod="crop");
    var urlRegExp = [
            /url\(['"]?([^'")]+)['"]?\)/g,
            /AlphaImageLoader\(src\=(?:['"])([^'"]+)['"]/g
        ];
    urlRegExp.forEach(function (regExp) {
        var res;
        while (res = regExp.exec(cssText)) {
            images.push({text: res[0], src: res[1]});
        }
    });

    var filePath = path.join(_this.root, _this.subDir, source.src);
    // путь до картинки высчитывается относительно файла в котором найдено ее упоминание
    var baseDir = path.dirname(filePath);

    abc.async.forEach(
        images,
        function (image, callback) {
            // игнорируем файлы с указанной схемой (//)
            if (image.src.indexOf('//') !== -1) {
                callback();
                return;
            }

            var imagePath = path.join(baseDir, image.src);
            path.exists(imagePath, function (exists) {
                // игнорируем несуществующие файлы
                if (!exists) {
                    console.log('image not found: \'' + imagePath + '\' in \'' + filePath + '\'');
                    callback();
                    return;
                }

                // в addResource нужен путь от module.root до файла, 
                // baseDir не подходит потому что в него включен module.root
                module.addResource(
                    path.join(
                        path.dirname(path.join(_this.subDir, source.src)), // путь до директории с исходным файлом
                        image.src
                    )
                );

                if (!module.description.noDataUrlOptimization) {
                    abc.file.binRead(imagePath, function (data) {
                        var newText = image.text.replace(
                            image.src,
                            'data:image/' + path.extname(image.src).substr(1) + ';base64,' + data.toString('base64')
                        );
                        cssText = cssText.replace(image.text, newText);
                        callback();
                    });
                } else {
                    imageManager.processImage(
                        imagePath,
                        function (finalName) {
                            // ниже делается предположение что картинка не называется как подстрока AlphaImageLoader
                            // и заменится именно адрес картинки
                            var newText = image.text.replace(image.src, 'PLACEHOLDER_FOR_IMAGE_PATH' + finalName);
                            cssText = cssText.replace(image.text, newText);
                            callback();
                        }
                    );
                }
            })
        },
        function () {
            callback(cssText);
        }
    );
};

function wrapSource (text) {
    // экранируем символ одинарной кавычки и переноса строки
    text = text.replace(/\'/g, '\\\'').replace(/\n|\r/g, '');
    // ищем вставки YA_IMAGE_PATH, которые нужно заменить на путь до картинок
    text = text.split('PLACEHOLDER_FOR_IMAGE_PATH').join('\'+p.IMAGE_PATH+\'');
    return [
        'function (p) {return \'',
        text,
        '\'}'
    ].join('');
};