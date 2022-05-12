import React from 'react'
import './closeFriend.css'

const CloseFriend = () => {
  return (
    <li className="sidebarFriend">
      <div className="friendImg">
        <img
          className="sidebarFriendImg"
          src="./assets/person/pic4.jpg"
          alt=""
        />
      </div>
      <span className="sidebarFriendName">Jane Doe</span>
    </li>
  );
}

export default CloseFriend
