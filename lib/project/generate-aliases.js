var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var alphabetSize = alphabet.length;

/* 
Каждому модулю приписывает алиас, уникальный в рамках текущей сборки проекта.
Сначала расставляем алиасы модулям, потом пакетам. Делаем это для того чтобы было легче
генерировать патроны при стрельбах - просто предполагаем, что первые n алиасов принадлежат модулям.
*/
exports.generate = function (project, callback) {
    var counter = 0;
    var gen = function (object) {
        object.alias = alphabet[Math.floor(counter / alphabetSize)] + alphabet[counter % alphabetSize];
        counter++;
    };

    project.getModules().forEach(gen);
    project.getPackages().forEach(gen);
    callback();
};