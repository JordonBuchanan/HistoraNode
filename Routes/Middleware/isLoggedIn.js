const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Sign In First");
    res.redirect("/");
}

module.exports = isLoggedIn;