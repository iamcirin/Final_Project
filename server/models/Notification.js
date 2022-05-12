const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
    },
    currentUserName: {
      type: String,
    },
    hasBeenLikedId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
