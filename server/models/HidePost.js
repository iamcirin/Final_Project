const mongoose = require("mongoose");

const HidePostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HidenPost", HidePostSchema);
