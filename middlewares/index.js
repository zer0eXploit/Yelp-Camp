const Comment = require("../models/comment");
const Campground = require("../models/campground");

const middleWareObject = {};

middleWareObject.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
  }
};

middleWareObject.loggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("success", "You have already been logged in! No need for that!");
    return res.back();
  } else {
    next();
  }
};

middleWareObject.checkCommentOwnership = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const foundComment = await Comment.findById(req.params.comment_id);

      if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash("error", "The comment is not found!");
        res.status(404).redirect("back");
      }
    } catch (error) {
      console.log(error.message);
      req.flash("error", "Something went wrong on our server!");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
  }
};

middleWareObject.checkCampgroundOwnership = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const foundCampground = await Campground.findById(req.params.id);
      if (foundCampground.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect("back");
      }
    } catch (error) {
      console.log(error.message);
      req.flash("error", "Something went wrong on our server!");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
  }
};

module.exports = middleWareObject;
