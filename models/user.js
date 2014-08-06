var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt');


//Create a user schema with username, password, and permissions fields
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    permissions: String
});


//Encrypt password before saving
userSchema.pre('save', function(next) {
    var user = this;
    //Check to make sure password has been modified before encrypting it
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//A user schema method for use in passport.js
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//Return User model when required 
module.exports = User = mongoose.model('User', userSchema);
