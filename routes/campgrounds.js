const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleWare = require("../middlewares");

router.get("/", (req, res) => {
  Campground.find({}, (err, allCampGrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campground/campgrounds", {
        title: "CampGrounds",
        data: allCampGrounds
      });
    }
  });
});

router.post("/", middleWare.isLoggedIn, (req, res) => {
  let campName = req.body.name;
  let imgUrl = req.body.url;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampGroundData = {
    name: campName,
    imageUrl: imgUrl,
    description: description,
    author: author
  };

  Campground.create(newCampGroundData, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

router.get("/new", middleWare.isLoggedIn, (req, res) => {
  res.render("campground/addNewCamp", { title: "Add New Camp" });
});

router.get("/:id", (req, res) => {
  let id = req.params.id;

  Campground.findById(id)
    .populate("comments")
    .exec((err, foundCampGround) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campground/campGroundInfo", {
          title: "CampDetails",
          data: foundCampGround
        });
      }
    });
});

// Edit and Update Routes
router.get("/:id/edit", middleWare.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) console.log(err);
    else {
      res.render("campground/editCamp", {
        title: `Edit ${foundCampground.name}`,
        data: foundCampground
      });
    }
  });
});

router.put("/:id", middleWare.checkCampgroundOwnership, (req, res) => {
  let updateData = req.body.campground;
  Campground.findByIdAndUpdate(req.params.id, updateData, (err, data) => {
    if (err) console.log(err);
    else {
      res.redirect("/campgrounds/" + data._id);
    }
  });
});

// Destroy Route

router.delete("/:id", middleWare.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, err => {
    if (err) console.log(err);
    else res.redirect("/campgrounds");
  });
});

module.exports = router;
