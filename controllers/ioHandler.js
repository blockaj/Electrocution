var routes = require('../router');
var mongoose = require('mongoose');
var Message =  require('../models/message');
var moment = require('moment');

module.exports = function(app, port) {
  var io = require('socket.io').listen(app.listen(port));
  io.on('connection', function(socket){


    //Set username to username based on session and login
    USERNAME = routes.getUsername();

    //Find all messages in databse
    Message.find(function(err, messages){
      var messagesUpdated = new Array();

      //Loop through messages
      for (i = 0; i < messages.length; i++) {
        var message = messages[i];
        var hrsago = moment().subtract('days', 1);
        console.log(hrsago);
        var timeSinceMessage = moment(message.time_stamp).subtract('days', 1);

        //If it's less than a day old, push it to the messagesUpdated to send through socket.io
        if (timeSinceMessage < hrsago) {
          console.log('Message is less than 24 hrs old.');
          messagesUpdated.push(message);

        }
      }
      socket.emit('updateMessages', {'messages': messagesUpdated});
    });

    //Let the client know who you are
    socket.emit('undist', {'username': USERNAME});

    //Recieve a user's message
    socket.on('userMessage', function(data){
      var message = new Message({author: data.username, content: data.message});
      message.save(function(err){
        if (err) {
          console.log(err);
        }
      });

      //And send it out to everybody
      io.sockets.emit('broadcast', {'message': data.message, 'username': data.username});
    });
  });
}
