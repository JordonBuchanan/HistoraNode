const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require('../../models/Comment');

function checkCommentOwn(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
           if(err){
               req.flash("error", "Comment Not Found");
               res.redirect("back");
           } else {
              if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
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

module.exports = checkCommentOwn;