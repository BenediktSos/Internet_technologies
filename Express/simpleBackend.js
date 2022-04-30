'use strict'
const express = require('express');
const { dirname } = require('path');
const app = express();
const path = require('path')
app.use(express.static('public'))

// Wir laden contents aus dem public Ordner
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/media', express.static(__dirname + '/public/media'))


/**
* Starts the Express server.
* @return {ExpressServer} 
*/
function startServer() {
// Start the server
    return app.listen('8080', () => {
        console.log('Local Server Started on port 8080...')
    })
}

app.get('/request', function (req, res) {
    res.sendFile(__dirname + "/public/request.html")
})
    
app.get('/answer', function (req, res) {
    res.sendFile(__dirname + "/public/answer.html")
})
    
startServer()
