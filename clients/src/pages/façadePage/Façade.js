import React from "react";
import "./façade.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Moment from "react-moment";
const Façade = () => {
  const [time, setTime] = useState(Date.now());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const handleClick = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };
  return (
    <div className="façade">
      <div className="logout">
        <span className="username">{user.username}</span>
        <IoMdArrowDropdown className="logoutIcon" />
        <ul className="optionList">
          <li className="option" onClick={handleClick}>
            Log out
          </li>
          {/* <li className="option">Settings</li> */}
        </ul>
      </div>

      <div className="dateWelcome">
        <div className="time">
          {<Moment format=" MMMM Do YYYY, h:mm a">{time}</Moment>}
        </div>
        <div className="welcome">Welcome, {user.username}</div>
      </div>

      <div className="façadeContainer">
        <Link to="/">
          <img className="logosocial" src="/assets/person/logo5.png" alt="" />
        </Link>
        <Link to="/weather">
          <img
            className="logoweather"
            src="/assets/person/logoweather.png"
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default Façade;
