var routes = require('../router');
var mongoose = require('mongoose');
var Message =  require('../models/message');
var moment = require('moment');

module.exports = function(app, port) {
  var io = require('socket.io').listen(app.listen(port));
  io.on('connection', function(socket){
    USERNAME = routes.getUsername();
    Message.find(function(err, messages){
      var messagesUpdated = new Array();
      for (i = 0; i < messages.length; i++) {
        var message = messages[i];
        var hrsago = moment().subtract('days', 1);
        console.log(hrsago);
        var timeSinceMessage = moment(message.time_stamp).subtract('days', 1);
        if (timeSinceMessage < hrsago) {
          console.log('Message is less than 24 hrs old.');
          messagesUpdated.push(message);

        }
      }
      socket.emit('updateMessages', {'messages': messagesUpdated});
    });
    socket.emit('undist', {'username': USERNAME});
    socket.on('userMessage', function(data){
      var message = new Message({author: data.username, content: data.message});
      message.save(function(err){
        if (err) {
          console.log(err);
        }
      });
      io.sockets.emit('broadcast', {'message': data.message, 'username': data.username});
    });
  });
}
