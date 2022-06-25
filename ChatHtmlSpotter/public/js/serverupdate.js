var socket = new WebSocket('ws://localhost:8181/', 'chat');
let myName;
socket.onopen = function () {

    myName = 'name' + Math.floor(Math.random() * Math.floor(1000));

    socket.send('{"type": "join", "name":" ' + myName + '"}');
}
$('.chat-input').submit(function (e) {
    e.preventDefault()

    msg = $('.chat-input input').val()
    serverMsg = '{"type": "msg", "msg": "' + msg + '"}'
    if (msg !== "") {
        socket.send(serverMsg);
    }
    $('.chat-input input').val('');
});

socket.onmessage = function (msg) {
    var data = JSON.parse(msg.data)
    switch (data.type) {
        case 'msg':
            appendMessage(data)
            break;
        case 'join':
            $('#users').empty();
            for (var i = 0; i < data.names.length; i++) {
                var user = $('<div>' + data.names[i] + '</div>');
                $('#users').append(user);
            }
            break;
    }
}

function splitMessage(msg) {
    return msg.split("EOL");
}

function buildMessageBody(messageLines) {
    let htmlText = "";
    for (let i = 0;i< messageLines.length; i++) {
        htmlText += '<p class="msg">' + messageLines[i] + '</p> <br>'
    }
    return htmlText;
}

function appendMessage(data) {
    let msg;

    const messageLines = splitMessage(data.msg);
    const dataMessage = buildMessageBody(messageLines);

    if (data.name.trim() === myName) {
         msg = '<article class="msg-container msg-self">' +
            '<div class="msg-box"><div class="flr"><div class="messages">' +
            //'<p class="msg">' +
             dataMessage +
             //'</p>' +
             '</div><span class="timestamp"><span class="username">' +
            myName + '</span></div><img class="user-img" id="user-0"' +
            'src="media/avatar_01.png"  alt="avatar"/></div></article>'
    } else {
         msg = '<article class="msg-container msg-remote"><div class="msg-box">' +
            '<img class="user-img" id="user-0" src="media/ai.png"  alt="avatar"/>' +
            '<div class="flr"> <div class="messages"> ' +
            //'<p class="msg">' +
             dataMessage +
            //'</p> ' +
            '</div><span class="timestamp"><span class="username">' +
            data.name +
            '</span></span></div> </div> </article>'
    }

    $('.chat-window').append(msg);
    document.querySelector(".msg-container:last-of-type").scrollIntoView({behavior: "smooth"})
}


