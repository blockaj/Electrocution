var passport = require('passport');
var USERNAME;
var User = require('../models/user');
var config = require('../config.json');

module.exports = function (app, user_reg) {
  var siteName = config.name || 'Electrocution';
  var siteDescription = config.description || 'A fancy server using websockets.';
  //Root
  app.get('/', function(req, res){
    return res.render('index.html', {
      name: siteName,
      description: siteDescription,
      user_reg: user_reg
    });
  });
  //Register page
  app.get('/register', function(req, res){

    //Check that admin set 'user registration' setting
    //to on, otherwise, no registration allowed
    if (user_reg) {
      res.render('register.html');
    }
    else {
      res.redirect('/unauthorized');
    }
  });
  //Require authentication to get a hold of the chat page
  app.get('/chat', ensureAuthenticated, function(req, res){
    req.session.username = USERNAME;
    return res.render('chat.html', {
      username: req.session.username
    });
  });
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  //Assign global var USERNAME the username
  //which the user types in. Use the local strategy
  //for authentication, redirecting to roots if it fails
  //and to chat if successful.
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

  //Registering an account? See controllers/register.js.
  app.post('/attempt_register', require('../controllers/register').post);


  //Require authentication for this page also
  //and use the user_reg variable to determine whether
  //or not allowing user registration should be on.
  app.get('/server-settings', ensureAuthenticated, function(req, res){
    User.findOne({username: USERNAME}, function(err, user){
      if (user.permissions == 'admin') {
        User.find(function(err, users){
          return res.render('server-settings-admin.html', {
            user_reg: user_reg,
            users: users
          });
        });
      }
      else {
        return res.render('server-settings-normal.html');
      }
    });

    console.log('redirecting...');
  });
  app.get('/unauthorized', function(req, res){
    return res.render('unauthorized.html');
  });
  app.post('/update-settings', function(req, res){
    var post = req.body;

    //Check if user typed in different password than default value
    //look for the user with their username in the database and
    //change the password to what they specified
    if (post.password != 'password') {
      User.findOne({username: USERNAME}, function(err, user){
        user.password = post.password;
        user.save();
        console.log(user);
      });
    }

    //Check if the user changed the username field
    if (post.username != USERNAME) {
      //If they did, find their username in the database
      User.findOne({username: username}, function(err, user){
        //Make sure it doesn't already exist
        if (user){
          console.log('Username taken');
          return false;
        } else {
          //And change it
          user.username = post.username;
          user.save();
          return true;
        }
      });
    }

    //If the user allowed registration
    if (post.register == 'on') {
      user_reg = true;
    }
    else if (post.register == 'off') {
      user_reg = false;
    }

    //Check out the permissions of all of the users
    User.find(function(err, users){
      for (i = 0; i < users.length; i++) {
        var user = users[i];
        if (req.body[user.username] == 'admin') {
          user.permissions = 'admin'
          user.save(function(err){
            if (err) { console.log(err); }
          });
        } else if (req.body[user.username] == 'normal') {
          user.permissions = 'normal';
          user.save(function(err) {
            if (err) { console.log(err); }
          });
        }
      }
    });
    return res.redirect('/chat');
  });
}


//Use the passport isAuthenticated() to
//see whether or not a user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/unauthorized');
}

//Get the username from anywhere
module.exports.getUsername = function() {
  console.log(USERNAME);
  return USERNAME;
}
