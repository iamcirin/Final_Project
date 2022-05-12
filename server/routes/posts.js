const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const HidenPost = require("../models/HidePost");
const Notification = require("../models/Notification");
//create a post
router.post("/", async (req, res) => {
  const newPost = await new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json("error");
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post
router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("post has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//like - dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      const noti = await new Notification({
        postId: req.params.id,
        currentUserName: req.body.username,
        hasBeenLikedId: req.body.hasBeenLikedId,
      });
      await noti.save();
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get Notifications

router.get("/notification/:id", async (req, res) => {
  try {
    const notifications = await Notification.find({
      hasBeenLikedId: req.params.id,
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});
//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user's all posts

router.get("/profile/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//who made the likes on a post
router.get("/likes/:postId", async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.postId });
    const liked = await Promise.all(
      post[0].likes.map((personId) => {
        return User.find({ _id: personId });
      })
    );

    res.status(200).json(liked);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/hide", async (req, res) => {
  try {
    const hided = await new HidenPost(req.body);
    const savedHidedPost = await hided.save();
    res.status(200).json(savedHidedPost);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.get("/hide/:userId", async (req, res) => {
  try {
    const hiddenPosts = await HidenPost.find({ userId: req.params.userId });
    res.status(200).json(hiddenPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
