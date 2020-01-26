const mongoose = require("mongoose"),
  Comment = require("./comment"),
  User = require("./user");

const campSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  description: String,
  author: {
    id: {
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

module.exports = mongoose.model("Campground", campSchema);
