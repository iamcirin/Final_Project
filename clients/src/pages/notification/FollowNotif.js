import axios from "axios";
import React, { useEffect, useState } from "react";
import "./notification.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import { TiUserAdd } from "react-icons/ti";
import { format } from "timeago.js";

const Notification = () => {
  const [followNotifications, setFollowNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/users/notifications/follow/" + user._id
        );

        setFollowNotifications(
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
  console.log(followNotifications);
  return (
    <div className="notification">
      <Topbar />

      <div className="notificationWrapper">
        <div className="rect2"></div>
        <div className="notifCenter">
          <div className="notifRight">
            {followNotifications.map((notif) => {
              return (
                <div key={notif._id} className="notifWrapper">
                  <span>
                    <b>{notif.followerName} </b>
                    followed you
                  </span>
                  <span className="postDate">{format(notif.createdAt)}</span>
                  <TiUserAdd style={{ color: "blue" }} className="notifHeart" />
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
