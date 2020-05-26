const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  User = require("./models/user"),
  expressSession = require("express-session"),
  passport = require("passport"),
  passportLocalStrategy = require("passport-local"),
  back = require("express-back"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

// Connect to DB
// process.env.MONGODB_URI
mongoose
  .connect(
    "mongodb+srv://yan:YelpCamp@cluster0-jvrot.gcp.mongodb.net/YelpCamp?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
    }
  )
  .then(console.log("Connected!"));

// Import routes
const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

// seedDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
  expressSession({
    secret: "SUPER_SECURE_SECRET",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(back());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to send data to views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Server
app.listen(process.env.PORT || "3000", () => {
  console.log("Server Started!");
});
