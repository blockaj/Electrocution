var passport = require('passport');
var USERNAME;

module.exports = function (app, user_reg) {
  //Root
  app.get('/', function(req, res){
    return res.render('index.html');
  });
  //Register page
  app.get('/register', function(req, res){
  /*
    Check that admin set 'user registration' setting
    to on, otherwise, no registration allowed
   */
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
  /*
    Assign global var USERNAME the username
    which the user types in. Use the local strategy
    for authentication, redirecting to roots if it fails
    and to chat if successful.
  */
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

  /*
    Require authentication for this page also
    and use the user_reg variable to determine whether
    or not allowing user registration should be on.
  */
  app.get('/server-settings', ensureAuthenticated, function(req, res){
    return res.render('server-settings.html', {
      user_reg: user_reg
    });
    console.log('redirecting...');
  });
  app.get('/unauthorized', function(req, res){
    return res.render('unauthorized.html');
  });
  app.post('/update-settings', function(req, res){
    var post = req.body;
    if (post.password != 'password') {

    }
    if (post.register == 'on') {
      user_reg = true;
    }
    else if (post.register == 'off') {
      user_reg = false;
    }
    return res.redirect('/server-settings');
  });
}

/*
  Use the passport isAuthenticated() to
  see whether or not a user is logged in
*/
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/unauthorized');
}

module.exports.getUsername = function() {
  console.log(USERNAME);
  return USERNAME;
}
