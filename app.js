/*


name: Bugfree Archer
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
    User = require('./models/user'),
    Message = require('./models/message'),
    nunjucks = require('nunjucks'),
    routes = require('./router'),
    ioHandler = require('./controllers/ioHandler'),
    USERNAME,
    USER_REG = false,
    config = require('./config.json');

//Connect to a specific db
mongoose.connect('mongodb://localhost/' + config.db);

//Express setup
app.use(express.static('public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser('dont tell nobody my secret'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var session = require('express-session');
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
  User.remove({}, function(err){
    if (err) { console.log(err); }
      console.log(User);
  });
  Message.remove({}, function(err){
    if (err) { console.log(err); }
  });
  var adminUser = new User({username: config.adminUsername, password: config.adminPassword, permissions: 'admin'});
  adminUser.save(function (err) {
    console.log(adminUser);
    console.log("New user 'admin' created.");
  });
  if (adminUser){
    console.log(adminUser);
  }
}



console.log('Server ON. http://127.0.0.1:' + config.port);
