import axios from "axios";
import React, { useEffect, useState } from "react";
import "./notification.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import { RiChatHeartFill } from "react-icons/ri";
import { format } from "timeago.js";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/posts/notification/" + user._id
        );

        setNotifications(
          res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, [user]);
  console.log(notifications);
  return (
    <div className="notification">
      <Topbar />

      <div className="notificationWrapper">
        <div className="rect"></div>
        <div className="notifCenter">
          <div className="notifRight">
            {notifications.map((notif) => {
              return (
                <div key={notif._id} className="notifWrapper">
                  <span>
                    <b>
                      {notif.currentUserName !== user.username
                        ? notif.currentUserName
                        : "You"}{" "}
                    </b>
                    liked your post
                  </span>
                  <span className="postDate">{format(notif.createdAt)}</span>
                  <RiChatHeartFill className="notifHeart" />
                </div>
              );
            })}
          </div>
          <img className="illus" src="/assets/background/notif2.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Notification;
