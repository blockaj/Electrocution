var socket = io.connect('http://localhost:3000');
var username;
socket.on('undist', function(un){
    username = un.username;
});

socket.on('broadcast', function(message){
    addMessageToView(message.username, message.message);
    var chatView = document.getElementById('chat-view');
    chatView.scrollTop = chatView.scrollHeight;
});
socket.on('updateMessages', function(allMessages){
  var messages = allMessages.messages;
  for (i = 0; i < messages.length; i++) {
    var message = messages[i];
    addMessageToView(message.author, message.content);
  }
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
    $('#chat-view').append('<div class="message"><p class="username">' + username + '</p>: ' + message + '</p></div>');
}

$(function(){
});
