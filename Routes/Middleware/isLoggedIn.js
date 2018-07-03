const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Sign In First");
    res.redirect("/");
}

module.exports = isLoggedIn;