/*const http = require('http')
const hostname = '127.0.0.1'
const port = 8080;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    res.end('<!DOCTYPE><html class=" qhnwnzk idc0_338"><head></head><body>' +
        '<div><h1>Mensch, super das geht!</h1>' +
        '<p>Hallo <del>Wlet</del><b> Welt</b>!</p>' +
        '<h2>Dies ist eine zweite Zeile</h2></div>' +
        '</body></html>')
});
server.listen(port, hostname, () => {
    console.log('Server laeuft unter http://' + hostname + ':' + port)
})
*/

var express = require('express')

var app = express()

app.use(express.static('public'))

// Wir laden contents aus dem public Ordner
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/images', express.static(__dirname + '/public/images'))

var server = app.listen(80, function () {
    var port = server.address().port
    console.log('Server wird gestartet http://localhost:%s', port)
})
