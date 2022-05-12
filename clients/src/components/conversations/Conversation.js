import React from "react";
import "./conversation.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    console.log("this is friends" + friendId);
    const getUser = async () => {
      try {
        const res = await axios("/users/" + friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  const PF = "http://localhost:8800/images";
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user.profilePicture
            ? PF + "/profile/" + user.profilePicture
            : "/assets/person/no-image.jpg"
        }
        alt=""
      />
      <span className="conversationName">{user.username}</span>
    </div>
  );
};

export default Conversation;
