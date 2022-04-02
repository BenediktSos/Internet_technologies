var express = require('express')

var app = express()

app.use(express.static('public'))

// Wir laden contents aus dem public Ordner
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/images', express.static(__dirname + '/public/images'))

var server = app.listen(8080, function() {
    var port = server.address().port
    console.log('Server wird gestartet http://localhost:%s', port)
})
