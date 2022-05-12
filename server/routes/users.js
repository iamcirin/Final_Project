const router = require("express").Router();
const User = require("../models/User");
const FollowNotification = require("../models/FollowNotification");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        {
          new: true,
        }
      );
      res.status(200).send("Account has been updated\n" + user);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can update only your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.deleteOne({ _id: req.params.id });
      res.status(200).send("Account has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});
//get a user(one user)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updateAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get friends

router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((follower) => {
        return User.findById(follower);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/followers/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const followers = await Promise.all(
      user.followers.map((follower) => {
        return User.findById(follower);
      })
    );

    let followersList = [];
    followers.map((follower) => {
      const { _id, username, profilePicture } = follower;
      followersList.push({ _id, username, profilePicture });
    });

    res.status(200).json(followersList);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        const followNotif = await new FollowNotification({
          followerName: req.body.followerName,
          followedId: req.params.id,
        });
        followNotif.save();
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already following this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("user is been unfollowing");
      } else {
        res.status(403).json("you already unfollowing this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("youn cannot unfollow yourself");
  }
});

//search a user

router.get("/search/:name", async (req, res) => {
  const users = await User.find({ username: { $regex: req.params.name } });
  res.status(200).json(users);
});

//find follow notifications

router.get("/notifications/follow/:id", async (req, res) => {
  try {
    const notifs = await FollowNotification.find({
      followedId: req.params.id,
    });
    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
