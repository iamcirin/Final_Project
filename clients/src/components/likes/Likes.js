import React from "react";

const Likes = ({ person }) => {
  const PF = "http://localhost:8800/images/";
  return (
    <div className="singlePersonLike" key={person[0]._id}>
      <img
        className="likeImg"
        src={
          person[0].profilePicture
            ? PF + "profile/" + person[0].profilePicture
            : "/assets/person/no-image.jpg"
        }
        alt=""
      />
      <span className="likeName">{person[0].username}</span>
    </div>
  );
};

export default Likes;
