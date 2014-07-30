var socket = io.connect('http://localhost:3000');
var username =
function sendMessage() {
    if ($('.text-box').val() != '') {
        socket.emit('userMessage', {'message': $('text-box').val, 'username': username});
    }
}
function checkKeyCode() {
    
}

$(function(){

});
