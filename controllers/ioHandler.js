var routes = require('../router');

module.exports = function(app, port) {
  var io = require('socket.io').listen(app.listen(port));

  io.on('connection', function(socket){
    USERNAME = routes.getUsername();
    console.log('Username: ' + USERNAME);
    socket.emit('undist', {'username': USERNAME});
    socket.on('userMessage', function(data){
      console.log(data.message);
      io.sockets.emit('broadcast', {'message': data.message, 'username': data.username});
    });
  });
}
