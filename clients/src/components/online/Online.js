import React from "react";
import "./online.css";
const Online = ({ follower }) => {
  const PF = "http://localhost:8800/images/";
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img
          className="rightbarProfileImg"
          src={
            follower.profilePicture
              ? PF + "profile/" + follower.profilePicture
              : "/assets/person/no-image.jpg"
          }
          alt=""
        />
        {/* <span className="rightbarOnline"></span> */}
      </div>
      <span className="ightbarUsername">{follower.username}</span>
    </li>
  );
};

export default Online;
