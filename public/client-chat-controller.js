var socket = io.connect('http://localhost:3000');
var username;
socket.on('undist', function(un){
    username = un.username;
});

socket.on('broadcast', function(message){
    console.log(message.username + ': ' + message.message);
    addMessageToView(message.username, message.message);
    var chatView = document.getElementById('chat-view');
    chatView.scrollTop = chatView.scrollHeight;
});
function sendMessage() {
    var messageContent = $('.chat-box').val();
    if (messageContent == 'server: settings') {
        $.get('/server-settings', 'working', function(err){
          if (err) { console.log(err); }
        });
    }
    else{
        if ($('.chat-box').val() != '') {
            socket.emit('userMessage', {'message': messageContent, 'username': username});
        }
        $('.chat-box').val("");
    }

}
function checkKeyCode() {
    if (event.keyCode == 13) {
        sendMessage();
    }
}


function addMessageToView(username, message) {
    $('#chat-view').append('<div class="message"><p>' + username + ': ' + message + '</p></div>');
}

$(function(){
});
console.log(username);
