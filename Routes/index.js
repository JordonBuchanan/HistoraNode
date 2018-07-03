const express = require('express');
const router = express.Router();
const passport = require('passport');

const Post = require('../models/post');
const User = require('../models/user');
const Mongoose = require('mongoose');
const Comment = require('../models/comment');
const checkCommentOwn = require('./Middleware/checkCommentOwn');
const checkPostOwn = require('./Middleware/checkPostOwn');
const isLoggedIn = require('./Middleware/isLoggedIn');
const upload = require('./Middleware/upload');


//==================
//GET ROUTES
//==================

router.get("/", (req, res) => {
    res.render("Home.ejs");
});

router.get("/Forum/new", isLoggedIn, (req, res) => {
    res.render("new.ejs")
});

router.get("/Forum", (req, res) => {
    Post.find({}, function(err, allPost){
        if(err){
            req.flash("error", "Error");
            console.log(err);
        } else {
            res.render("Forum", {Post:allPost});
        }
    });
});

router.get("/Forum/:id", isLoggedIn, (req, res) => {
    Post.findById(req.params.id).populate("comments").exec((err, foundPost) => {
        if(err){
            req.flash("error", "Post Doesn't Exist");
            console.log(err);
        } else{
            res.render("show", {Post: foundPost});
        }
    })
});

router.get("/Forum/:id/edit", checkPostOwn, isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        res.render("edit", {Post: foundPost});
    });
});

router.put("/Forum/:id",checkPostOwn, isLoggedIn, (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body.Post, (err, updatedPost) => {
        if(err){
            req.flash("error", "Error");
            res.redirect("/Forum");
        } else {
            req.flash("success", "Edit Successful");
            res.redirect("/Forum/" + req.params.id);
        }
    });
});

router.delete("/Forum/:id",checkPostOwn, isLoggedIn, (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            req.flash("error", "Error");
            res.redirect("/Forum");
        }else{
            req.flash("success", "Post Deleted");
            res.redirect("/Forum");
        }
    });
});

//===================
//POST ROUTES
//===================

router.post("/Forum", isLoggedIn, upload.single('image'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (result) => {
    var name = req.body.name;
    var image = req.body.image = result.secure_url;
    var textField = req.body.textField;    
    
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = {name: name, image: image, textField: textField, author:author};

    Post.create(newPost, function(err, newlyCreated){
        if(err){
            req.flash("error", "Error");
            console.log(err);
        } else{
            req.flash("success", "Post Created");
            res.redirect("/Forum");
        }
    });
});
});

//===============
//COMMENT ROUTES
//==============

router.get("/Forum/:id/newcomment", isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, Post) => {
        if(err){                    
            req.flash("error", "Access Denied");
            console.log(err);
        } else{
            res.render("newcomment", {Post: Post});
        }
    }); 
});

router.post("/Forum/:id/comments", isLoggedIn, (req,res) => {
    Post.findById(req.params.id, (err, Post) => {
        if(err){
            console.log(err);
            res.redirect("/Forum");
        }else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Error");
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    Post.comments.unshift(comment);
                    Post.save();
                    req.flash("success", "Comment Added");
                    res.redirect("/Forum/" + Post._id);
                }
            });
        }
    });
});

router.get("/Forum/:id/comments/:comment_id/editcomment", checkCommentOwn, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("editcomment", {Post_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/Forum/:id/comments/:comment_id", checkCommentOwn, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, UpdatedComments) => {
        if(err){
            req.flash("error", "error");
            res.redirect("back");
        } else {
            req.flash("success", "Comment Edit Successful");
            res.redirect("/Forum/" + req.params.id);
        }
    });
});

router.delete("/Forum/:id/comments/:comment_id", checkCommentOwn, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            req.flash("error", "Error");
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("back");
        }
    });
});

//================
//AUTH ROUTE
//================

router.post("/register", (req, res) => {
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            website: req.body.website,
            email: req.body.email,
            biography: req.body.biography
        });
    if(req.body.adminCode === '2063'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
       if(err){
            req.flash("error", err.message);
            return res.render("Home");
       }
       passport.authenticate("local")(req, res, () => {
          req.flash("success", "Successfully Registered");
          res.redirect("/Forum");
       });
    });
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/Forum",
        failureRedirect: "/"
    }), (req, res) => {
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged Out");
    res.redirect("/");
});

router.get("/users/:id", isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        Post.find().where('author.id').equals(foundUser._id).exec((err, posts) => {
           if(err) {
               console.log(err);
               res.redirect("/");
           }
        res.render("users/show", {user: foundUser, posts: posts});
        });
    });
});

//================
//ALL ROUTE
//================

router.get("*", (req, res) => {
    res.render("all.ejs")
});

module.exports = router;