const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');

function checkPostOwn(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, (err, foundPost) => {
           if(err){
               req.flash("error", "Post Not Found");
               res.redirect("back");
           } else {
              if(foundPost.author.id.equals(req.user._id) || req.user.isAdmin){
                  next();
              } else {
                req.flash("error", "Permission Denied");
                res.redirect("back");
              }
           }
        });
    } else {
        req.flash("error", "Please Sign In First");
        res.redirect("back");
    }
}

module.exports = checkPostOwn;