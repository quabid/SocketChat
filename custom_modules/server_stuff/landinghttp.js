/* const fs = require('fs'),
    path = require('path'),
    index = path.join(__dirname, 'start.html');

fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
        console.log('received data: ' + data);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
    } else {
        console.log(err);
    }
}); */

module.exports = {
    index: require('../../views/landing/index'),
    about: require('../../views/landing/about'),
    // contact: require('../../views/landing/contactform')
};