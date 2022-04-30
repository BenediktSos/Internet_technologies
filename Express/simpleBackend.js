'use strict'
const express = require('express');
const app = express();
app.use(express.static('public'))

// Wir laden contents aus dem public Ordner
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/images', express.static(__dirname + '/public/images'))



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
    res.sendFile("/home/benedikts/Hochschule/2.Semester/Internettechnologien/Block_1/Internet_technologies/Express/public/request.html")
    
})
    
app.get('/answer', function (req, res) {
    let sender = req.query.sender
    let reciever = res.query.reciever
    let message = req.query.message

    let sender_display = document.getElementById("sender_display")
    let reciever_display = document.getElementById("reciever_display")
    let message_display = document.getElementById("message_display")
    
    sender_display.innerHTML = sender
    reciever_display.innerText = reciever
    message_display.innerText = message

    res.send(sender_display)

    res.sendFile("/home/benedikts/Hochschule/2.Semester/Internettechnologien/Block_1/Internet_technologies/Express/public/answer.html")
})
    
startServer()
    
