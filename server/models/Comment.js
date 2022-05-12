const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
    },
    username: {
      type: String,
    },
    userId: {
      type: String,
    },
    text: {
      type: String,
      max: 500,
    },
    userProfilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
