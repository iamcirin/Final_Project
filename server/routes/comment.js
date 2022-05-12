const router = require("express").Router();
const Comment = require("../models/Comment");

router.post("/", async (req, res) => {
  const comment = await new Comment(req.body);
  try {
    const savedComment = await comment.save();
    res.status(200).json("comment posted");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete Comment

router.delete("/delete/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json("comment deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
