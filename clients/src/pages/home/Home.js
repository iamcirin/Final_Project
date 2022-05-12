import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { loginCall } from "../../apiCalls";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";

const Home = ({ accessToken }) => {
  // const {
  //   user: currentUser,
  //   dispatch,
  //   isFetching,
  //   error,
  // } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!currentUser) {
  //     loginCall({ headers: { authorization: accessToken } }, dispatch);
  //   }
  // }, [currentUser, accessToken, dispatch]);
  // // console.log("this is the error " + error);
  // const { user } = useContext(AuthContext);
  // console.log("this is user after the call from home" + user);

  // console.log("this is dispatch after the call from home" + dispatch);
  // console.log("this is the token " + accessToken);
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed home />
        <Rightbar />
      </div>
    </>
  );
};

export default Home;
