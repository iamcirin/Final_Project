import React from "react";
import "./message.css";
import { format } from "timeago.js";
import axios from "axios";
import { useEffect, useState } from "react";

const Message = ({ currentUser, message, own, conversation }) => {
  const PF = "http://localhost:8800/images";
  //added by me
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
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {!own && (
          <img
            className="messageImg"
            src={
              user.profilePicture
                ? PF + "/profile/" + user.profilePicture
                : "/assets/person/no-image.jpg"
            }
            alt=""
          />
        )}

        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
