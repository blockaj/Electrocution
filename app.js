var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var Message = require('./models/message');
var nunjucks = require('nunjucks');
var USERNAME;

//Connect to a specific db
mongoose.connect('mongodb://localhost/SpecialChat');

//Express setup
app.use(express.static('public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser('dont tell nobody my secret'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var session = require('express-session');
app.use(session({secret: 'dont tell nobody my secret',
                resave: true,
                saveUninitialized: true
                }));

app.use(passport.initialize());
app.use(passport.session());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

//Passport setup
passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
      done(err, user);
  });
});
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
        return done(null, user);
      });
    }
));


app.get('/', function(req, res){
  return res.render('index.html');
});

app.get('/chat', function(req, res){
  req.session.username = USERNAME;
  console.log(req.session);
  return res.render('chat.html', {
    username: req.session.username
  });
});

app.post('/attempt_login', function(req, res, next){
  USERNAME = req.body.username;
  passport.authenticate('local', function(err, user, info){
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    req.logIn(user, function(err){
      if (err) { return next(err); }
      return res.redirect('/chat');
    });
  })(req, res, next);
});

app.get('/server-settings', function(req, res){
  return res.render('server-settings.html');
  console.log('redirecting...');
});

app.post('/go-to-server-settings', function(req, res){
  console.log('hey');
  return res.redirect('/server-settings');
  console.log('about to redirect');
});




var io = require('socket.io').listen(app.listen(3000));

io.on('connection', function(socket){
  console.log('Username: ' + USERNAME);
  socket.emit('undist', {'username': USERNAME});
  socket.on('userMessage', function(data){
    console.log(data.message);
    io.sockets.emit('broadcast', {'message': data.message, 'username': data.username});
  });
});

if (process.argv[2] == 'reset'){
  User.remove({}, function(err){
    console.log('All users have been removed.');
  });
  Message.remove({}, function(err){
    console.log('All messages have been removed.');
  });
  var adminUser = new User({username: 'admin', password: 'password'});
  adminUser.save(function (err) {
    console.log("New user 'admin' created.");
  });
}

console.log('Server ON. http://127.0.0.1:3000');
