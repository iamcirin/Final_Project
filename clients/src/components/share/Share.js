import React from "react";
import "./share.css";
import {
  MdPermMedia,
  MdNewLabel,
  MdRoom,
  MdEmojiEmotions,
} from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { MdCancel } from "react-icons/md";

const Share = () => {
  const { user } = useContext(AuthContext);
  const PF = "http://localhost:8800/images/";
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [theCurrent, setTheCurrent] = useState("");
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get("/users/" + user._id);
        setTheCurrent(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrentUser();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post("/upload", data);
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              theCurrent.profilePicture
                ? PF + "profile/" + theCurrent.profilePicture
                : "/assets/person/no-image.jpg"
            }
            alt=""
          />

          <input
            placeholder={`What's on your mind ${user.username}`}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <MdCancel
              className="shareCancelImg"
              onClick={() => {
                setFile(null);
              }}
            />
          </div>
        )}
        <form className="shareBottom" onSubmit={handleSubmit}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <MdPermMedia color="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo/Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpg, jpeg"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </label>

            <div className="shareOption">
              <MdNewLabel color="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>

            <div className="shareOption">
              <MdRoom color="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>

            <div className="shareOption">
              <MdEmojiEmotions color="gold" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
