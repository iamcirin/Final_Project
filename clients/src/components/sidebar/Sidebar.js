import React from "react";
import "./sidebar.css";
import { MdOutlineVideoSettings, MdRssFeed } from "react-icons/md";
import { BiGroup } from "react-icons/bi";
import { BsBookmarkCheck, BsCalendarEvent } from "react-icons/bs";
import { SiGooglemessages } from "react-icons/si";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link className="link" to="/">
              <MdRssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </Link>
          </li>

          <li className="sidebarListItem">
            <Link className="link" to="/messenger">
              <SiGooglemessages className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <MdOutlineVideoSettings className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <BiGroup className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <BsBookmarkCheck className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <BsCalendarEvent className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {/* <CloseFriend /> */}
          <Link to="/main">
            <div className="return">Return to main</div>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
