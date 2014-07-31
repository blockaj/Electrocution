var User = require('../models/user');

module.exports.post = function(req, res) {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        permissions: 'normal'
    });
    newUser.save(function(err){
        if (err) {
            req.sessions.messages = [err];
            res.redirect('/register');
        } else {
            req.login(newUser, function(err){
                if(err) {
                    req.session.messages =  [err];
                    res.redirect('/register');
                } else {
                    res.redirect('/');
                }
            });
        }
    });
}
