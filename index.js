  const express       = require("express"),
        app            = express(),
        bodyParser     = require("body-parser"),
        methodOverride = require("method-override"),
        session        = require("express-session"),
        LocalStrategy  = require("passport-local"),
        cookieParser   = require("cookie-parser"),
        mongoose       = require("mongoose"),
        passport       = require("passport"),
        flash          = require("connect-flash");
        multer         = require('multer');
        cloudinary     = require('cloudinary');

const indexRouter = require('./Routes/index');
const Posts = require('./models/Post');
const User = require('./models/User');
const Comment = require('./models/Comment')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/Views/public'));
app.set('views', __dirname + '/Views');
app.use(express.static('files'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(cookieParser('secret'));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.locals.moment = require('moment');
app.use(require("express-session")({
    secret: "CharlesMartell",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

 //Initializing the Landing Page
app.use('/', indexRouter);

//Mongoose Configuration
//DB COnfig
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db)
    .catch(error => console.log(error))
    .then(() => console.log('MongoDB connected'));
    mongoose.set('debug', true);
    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
      }); 

//================
//LISTEN
//================

const server     =    app.listen(process.env.PORT || 3022, () => {
    console.log("We have started our server on port 3022");
});