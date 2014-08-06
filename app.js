/*


name: Electrocution
description: A pretty sophisticated server using
version: 0.0.0
author: Aaron Block


*/


var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    nunjucks = require('nunjucks'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    lessMiddleware = require('less-middleware'),
    less = require('less'),
    //Models used for storing information in the db
    User = require('./models/user'),
    Message = require('./models/message'),
    //Routes addresses
    routes = require('./router'),
    //Handles all websockets
    ioHandler = require('./controllers/ioHandler'),
    //Username stuff
    USERNAME,
    USER_REG = false,
    //Get configuration settings
    config = require('./config.json');





//Connect to a specific db
mongoose.connect('mongodb://localhost/' + config.db);

//Express setup
app.use(express.static(__dirname + '/public'));
app.use(lessMiddleware( __dirname + '/public/css',
                      {
                        dest: __dirname + '/public'
                      }));
app.use(cookieParser('dont tell nobody my secret'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: config.sessionSecret,
                resave: true,
                saveUninitialized: true
                }));
app.use(passport.initialize());
app.use(passport.session());
nunjucks.configure('views', {
  autoescape: true,
  express: app
});




//Passport setup for sessions
passport.serializeUser(function(user, done){
  return done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
      done(err, user);
  });
});


//Use a local strategy, no facebook, no google
passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({username: username}, function(err, user){
        if (err) { return done(err); }
        if (!user) { return done(null, false, {message: 'Incorrect username'}); }
        user.comparePassword(password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch) {
                return done(null, user);
            } else {
            }
        });
      });
    }
));

routes(app, USER_REG);
ioHandler(app, config.port);



//Remove all content from databases if 'reset' arg provided
//Recreate basic 'admin' account
if (process.argv[2] == 'reset'){
  var userInput = process.stdin;
  User.remove({}, function(err){
    if (err) { console.log(err); }
  });
  Message.remove({}, function(err){
    if (err) { console.log(err); }
  });
  var adminUser = new User({username: config.adminUsername, password: config.adminPassword, permissions: 'admin'});
  adminUser.save(function (err) {
    console.log("New user '"+ config.adminUsername +"' created.");
  });
}



console.log('Server ON. http://127.0.0.1:' + config.port);
