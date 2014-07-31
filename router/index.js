var passport = require('passport');
var USERNAME;

module.exports = function (app, user_reg) {
  app.get('/', function(req, res){
    return res.render('index.html');
  });
  app.get('/register', function(req, res){
    if (user_reg) {
      res.render('register.html');
    }
    else {
      res.redirect('/unauthorized');
    }
  });
  app.get('/chat', ensureAuthenticated, function(req, res){
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

  app.post('/attempt_register', require('../controllers/register').post);

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
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/unauthorized');
}

module.exports.getUsername = function() {
  console.log(USERNAME);
  return USERNAME;
}
