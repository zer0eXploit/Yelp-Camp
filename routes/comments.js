const express = require("express");
const router = express.Router({ mergeParams: true });
const middleWare = require("../middlewares/");

const Campground = require("../models/campground");
const Comment = require("../models/comment");

router.get("/new", middleWare.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, success) => {
    if (err) console.log(err);
    else {
      res.render("comment/newComment", {
        title: "Create a New Comment",
        id: req.params.id
      });
    }
  });
});

router.post("/", middleWare.isLoggedIn, (req, res) => {
  let newComment = req.body.comment;
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(campground);
      Comment.create(newComment, (err, comment) => {
        if (err) console.log(err);
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          console.log(comment);
          campground.comments.push(comment);

          campground.save((err, data) => {
            if (err) console.log(err);
            else {
              console.log(data);
              res.redirect("/campgrounds/" + campground._id);
            }
          });
        }
      });
    }
  });
});

// Edit Comment Routes

router.get(
  "/:comment_id/edit",
  middleWare.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundcomment) => {
      if (err) res.redirect("back");
      else
        res.render("comment/edit", {
          title: "Edit Comment",
          id: req.params.id,
          comment_id: req.params.comment_id,
          comment: foundcomment
        });
    });
  }
);

router.put("/:comment_id", middleWare.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, err => {
    if (err) res.send("error editing comment!");
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

// Delete Comments Route

router.delete("/:comment_id", middleWare.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) res.send("error editing comment!");
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

module.exports = router;
