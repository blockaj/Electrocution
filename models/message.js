var mongoose = require('mongoose');
var mongodb = require('mongodb');

//Setup schemas and models for chat messages and login functionality
var messageSchema = new mongoose.Schema({
    author: String,
    content: String,
    time_stamp: {type: Date, default: Date.now}
});

module.exports = Message = mongoose.model('Message', messageSchema);
