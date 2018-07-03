const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');

function isNotLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect("/Forum");
}

module.exports = isNotLoggedIn;