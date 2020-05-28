const express = require("express");
const router = express.Router({ mergeParams: true });
const middleWare = require("../middlewares/");

const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/new", middleWare.isLoggedIn, async (req, res) => {
  try {
    const foundCamp = await Campground.findById(req.params.id);
    if (foundCamp) {
      res.render("comment/newComment", {
        title: "Create a New Comment",
        id: foundCamp._id,
      });
    } else {
      res
        .status(404)
        .json({ message: "Hey! There is no such camp ground!", status: 404 });
    }
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Cannot find the campground!");
    res.redirect("/campgrounds");
  }
});

router.post("/", middleWare.isLoggedIn, async (req, res) => {
  const userComment = {
    text: req.body.comment,
    author: {
      id: req.user._id,
      username: req.user.username,
    },
  };
  try {
    const campGround = await Campground.findById(req.params.id);
    if (campGround) {
      const newComment = await Comment.create(userComment);
      campGround.comments.push(newComment);
      const updatedCampGround = await campGround.save();
      res.redirect("/campgrounds/" + updatedCampGround._id);
    }
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something went wrong on our server!");
    res.redirect("/campgrounds");
  }
});

// Edit Comment Routes

router.get(
  "/:comment_id/edit",
  middleWare.checkCommentOwnership,
  async (req, res) => {
    try {
      const foundComment = await Comment.findById(req.params.comment_id);
      if (foundComment) {
        res.render("comment/edit", {
          title: "Edit Comment",
          id: req.params.id,
          comment_id: req.params.comment_id,
          comment: foundComment,
        });
      } else {
        res
          .status(404)
          .json({ message: "Hey! There is no such camp ground!", status: 404 });
      }
    } catch (error) {
      req.flash("error", "Sorry something went wrong!");
      res.redirect("back");
    }
  }
);

router.put(
  "/:comment_id",
  middleWare.checkCommentOwnership,
  async (req, res) => {
    try {
      await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
      req.flash("success", "Comment Updated!");
      res.redirect("/campgrounds/" + req.params.id);
    } catch (error) {
      req.flash("error", "Sorry something went wrong!");
      res.redirect("back");
    }
  }
);

// Delete Comments Route

router.delete(
  "/:comment_id",
  middleWare.checkCommentOwnership,
  async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.comment_id);
      res.redirect("/campgrounds/" + req.params.id);
    } catch (error) {
      req.flash("error", "Sorry something went wrong!");
      res.redirect("back");
    }
  }
);

module.exports = router;
