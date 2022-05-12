const mongoose = require("mongoose");

const followNotificationSchema = new mongoose.Schema(
  {
    followerName: {
      type: String,
    },
    followedId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowNotification", followNotificationSchema);
