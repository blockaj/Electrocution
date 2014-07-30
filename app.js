var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require('./models/user');
var Message = require('./models/message');

//Connect to a specific db
mongoose.connect('mongodb://localhost/SpecialChat');

//Express setup
app.use(express.static('public'));

var cookieParser = require("cookie-parser");
app.use(cookieParser('dont tell nobody my secret'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var session = require("express-session");
app.use(session({secret: 'dont tell nobody my secret',
                resave: true,
                saveUninitialized: true
                }));

app.use(passport.initialize());
app.use(passport.session());

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
                    return done(null, false, {message: 'Incorrect password'});
                }
            });
            return done(null, user);
        });
    }
));






app.get('/', function(req, res){
    res.sendfile('./views/index.html');
});

app.get('/chat', function(req, res){
    res.sendfile('./views/chat.html');
});

app.post('/attempt_login',
    passport.authenticate('local', {successRedirect: '/chat',
                                    failureRedirect: '/'
                                })
);
var io = require("socket.io").listen(app.listen(3000));

io.on('connection', function(socket){
    socket.on('message', function(data){
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
