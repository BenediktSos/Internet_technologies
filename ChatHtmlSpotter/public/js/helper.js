function buildHTMLMessage(msg,name){
response = 
'<article class="msg-container msg-self" id="msg-0">' +
'<div class="msg-box"><div class="flr"><div class="messages">'+
'<p class="msg" id="msg-1">'+msg+'</p></div><span class="timestamp"><span class="username">' +
name + '</span></div><img class="user-img" id="user-0"'+
'src="//gravatar.com/avatar/56234674574535734573000000000001?d=retro" /></div></article>'}


function updateServer(){
    var socket = new WebSocket('ws://localhost:8181/', 'chat');
    var name = 'u1'
    socket.onopen = function () {

        name = "name" + Math.floor(Math.random() * Math.floor(700));

        socket.send('{"type": "join", "name":" '+name+'"}');
    }
    $('#sendBtn').on('click', function (e) {
        e.preventDefault();
        //name = 'u1',
        msg = $('.chat-input').val();
        socket.send('{"type": "msg", "msg": "' + msg + '"}');
        $('.chat-input').val('');
    });
    socket.onmessage = function (msg) {
        var data = JSON.parse(msg.data);
        switch (data.type) {
            case 'msg':
                var msg = $('<div>' + data.name + ': ' + data.msg +
                        '</div>');
                $('.chat-window').append(msg);
                break;
            case 'join':
                $('#users').empty();
                for (var i = 0; i < data.names.length; i++) {
                    var user = $('<div>' + data.names[i] + '</div>');
                    $('#users').append(user);
                }
                break;
        }
    };
 }