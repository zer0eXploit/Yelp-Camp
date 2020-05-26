const Comment = require("../models/comment");
const Campground = require("../models/campground");

const middleWareObject = {};

middleWareObject.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
  }
};

middleWareObject.loggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash("success", "You have already been logged in! No need for that!");
    return res.back();
  } else {
    next();
  }
};

middleWareObject.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) res.redirect("back");
      else {
        if (foundComment.author.id.equals(req.user._id)) {
          req.flash("success", "Comment Deleted!");
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
  }
};

middleWareObject.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) res.redirect("back");
      else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};

module.exports = middleWareObject;
