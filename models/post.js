const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var PostSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, default: Date.now },
    image: String,
    textField: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });


module.exports = mongoose.model("Post", PostSchema);