import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./chatOnline.css";

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const PF = "http://localhost:8800/images";
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/users/friends/" + currentId
      );
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/conversations/find/${currentId}/${user._id}`
      );
      if (res.data) {
        setCurrentChat(res.data);
      } else {
        const res = await axios.post(
          `http://localhost:8800/api/conversations/`,
          { senderId: currentId, receiverId: user._id }
        );
        setCurrentChat(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => {
        return (
          <div
            className="chatOnlineFriend"
            onClick={() => {
              handleClick(o);
            }}
          >
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src={
                  o?.profilePicture
                    ? PF + "/profile/" + o.profilePicture
                    : "/assets/person/no-image.jpg"
                }
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.username}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ChatOnline;
