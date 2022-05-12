import React from "react";
import "./topbar.css";
import { BsSearch, BsPerson } from "react-icons/bs";
import { RiMessengerLine } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { loginCall } from "../../apiCalls";

const Topbar = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [theCurrent, setTheCurrent] = useState("");
  const PF = "http://localhost:8800/images/";

  const { user, token } = useContext(AuthContext);
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

  const handleChange = async (e) => {
    setInputValue(e.target.value);
    if (inputValue) {
      const res = await axios.get(
        `http://localhost:8800/api/users/search/${inputValue}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setSearchUsers(res.data);
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Social</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <BsSearch className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="serach for friend, post or video"
            onChange={handleChange}
            value={inputValue}
          />{" "}
          {inputValue && (
            <ul className="userList">
              {searchUsers.map((user) => {
                const { _id, username, profilePicture } = user;
                return (
                  <Link className="link" to={"/profile/" + _id} key={_id}>
                    <li
                      className="singleUser"
                      onClick={() => {
                        setInputValue("");
                      }}
                    >
                      <img
                        className="searchImg"
                        src={
                          profilePicture
                            ? PF + "profile/" + profilePicture
                            : "/assets/person/no-image.jpg"
                        }
                        alt=""
                      />
                      {username}
                    </li>
                  </Link>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="topbarRight">
        {/* <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div> */}
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link to={"/notifications/follow/" + user._id}>
              <BsPerson />
            </Link>
            {/* <span className="topbarIconBadge">1</span> */}
          </div>

          <div className="topbarIconItem">
            <Link to="/messenger">
              <RiMessengerLine />
            </Link>
            {/* <span className="topbarIconBadge">1</span> */}
          </div>

          <div className="topbarIconItem">
            <Link to={"/notifications/" + user._id}>
              <MdNotificationsNone />
            </Link>
            {/* <span className="topbarIconBadge">1</span> */}
          </div>
        </div>
        <div className="profilePic">
          <Link to={`/profile/${user._id}`}>
            <img
              src={
                theCurrent.profilePicture
                  ? PF + "profile/" + theCurrent.profilePicture
                  : "/assets/person/no-image.jpg"
              }
              alt=""
              className="topbarImg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
