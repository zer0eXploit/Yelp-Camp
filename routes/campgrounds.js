const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleWare = require("../middlewares");

router.get("/", async (req, res) => {
  try {
    const allCampGrounds = await Campground.find({});
    res.render("campground/campgrounds", {
      title: "CampGrounds",
      data: allCampGrounds,
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something went wrong on our server!");
    res.redirect("/");
  }
});

router.post("/", middleWare.isLoggedIn, async (req, res) => {
  const { name, url, description, location } = req.body;
  const { _id, username } = req.user;

  const author = {
    id: _id,
    username: username,
  };

  try {
    const addedCampInfo = await Campground.create({
      name: name,
      imageUrl: url,
      description: description,
      location: location.replace(",", " "),
      author: author,
    });

    console.log("Added camp: " + addedCampInfo._id);
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something went wrong on our server!");
    res.redirect("/campgrounds");
  }
});

router.get("/new", middleWare.isLoggedIn, (req, res) => {
  res.render("campground/addNewCamp", { title: "Add New Camp" });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const foundCampGround = await Campground.findById(id)
      .populate("comments")
      .exec();
    if (foundCampGround) {
      res.render("campground/campGroundInfo", {
        title: "CampDetails",
        data: foundCampGround,
      });
    } else {
      res
        .status(404)
        .json({ message: "Hey! There is no such camp ground!", status: 404 });
    }
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something went wrong on our server!");
    res.redirect("/campgrounds");
  }
});

// Edit and Update Routes
router.get(
  "/:id/edit",
  middleWare.checkCampgroundOwnership,
  async (req, res) => {
    try {
      const camp = await Campground.findById(req.params.id);
      if (camp) {
        res.render("campground/editCamp", {
          title: `Edit ${camp.name}`,
          data: camp,
        });
      } else {
        res
          .status(404)
          .json({ message: "Hey! There is no such camp ground!", status: 404 });
      }
    } catch (error) {
      console.log(error.message);
      req.flash("error", "Something went wrong on our server!");
      res.redirect("/campgrounds");
    }
  }
);

router.put("/:id", middleWare.checkCampgroundOwnership, async (req, res) => {
  const { name, imageUrl, description, location } = req.body;

  try {
    const updatedCamp = await Campground.findByIdAndUpdate(req.params.id, {
      name: name,
      imageUrl: imageUrl,
      description: description,
      location: location.replace(",", " "),
    });
    res.redirect("/campgrounds/" + updatedCamp._id);
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something went wrong on our server!");
    res.redirect("/campgrounds");
  }
});

router.delete("/:id", middleWare.checkCampgroundOwnership, async (req, res) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something went wrong on our server!");
    res.redirect("/campgrounds");
  }
});

module.exports = router;
