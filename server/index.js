const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/messages");
const commentRoute = require("./routes/comment");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const verifyToken = require("./tokenMiddleware/verifyToken");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .then(() =>
    app.listen(8800, () => {
      console.log("Backend server is running");
    })
  );

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware

app.use(cors());
app.use(express.json()); //parsing post request
app.use(helmet()); // for secure request sending
app.use(morgan("common"));

app.use("/api/auth", authRoute);
// app.use(verifyToken);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comments", commentRoute);

// upload profile picture
const uploadPic = (path) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  const upload = multer({ storage });
  return upload;
};

app.post(
  "/api/upload",
  uploadPic("public/images").single("file"),
  async (req, res) => {
    try {
      return res.status(200).json("File uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  }
);

app.post(
  "/api/upload/profilePic",
  uploadPic("public/images/profile").single("file"),
  async (req, res) => {
    try {
      return res.status(200).json("File uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  }
);

app.post(
  "/api/upload/coverPic",
  uploadPic("public/images/cover").single("file"),
  async (req, res) => {
    try {
      return res.status(200).json("File uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  }
);

// app.listen(8800, () => {
//   console.log("Backend server is running");
// });
