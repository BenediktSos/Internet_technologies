var https = require('https')
const { isPromise } = require('util/types')

const options = {
    path: '/80.138.81.157/json/',
    host: 'ipapi.co',
    port: 443,
    headers : { 'User-Agent': 'nodejs-ipapi-v1.02' }
}

https.get(options, function (resp) {
    var body = ''
    resp.on('data', function (data) {
        body += data;
    });
    resp.on('end', function () {
        var loc = JSON.parse(body);
        console.log(loc);
    });
});
