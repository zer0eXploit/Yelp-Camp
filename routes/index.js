const express = require("express");
const router = express.Router({ mergeParams: true });
const middleWare = require("../middlewares/");

const User = require("../models/user");
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("landing", { title: "YelpCamp Home" });
});

// ============
// Auth Routes
// ============
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register an Account" });
});

router.post("/register", (req, res) => {
  let newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome to YelpCamp " + req.user.username);
        res.redirect("/campgrounds");
      });
    }
  });
});

router.get("/login", middleWare.loggedIn, (req, res) => {
  res.render("auth/login", { title: "Login" });
});

router.post(
  // there is a module call connect-ensure-login to use alongside passport
  "/login",
  passport.authenticate("local", {
    successFlash: "Welcome",
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "See You!");
  res.redirect("/campgrounds");
});

module.exports = router;
