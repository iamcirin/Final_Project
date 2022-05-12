import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
//http://localhost:8800/images/

const Profile = () => {
  const [user, setUser] = useState({});
  const [picFile, setPicFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const { user: currentUser, token } = useContext(AuthContext);
  const params = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/users/${params.id}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setUser(res.data);
    };

    fetchUser();
  }, [params.id, token]);
  const PF = "http://localhost:8800/images/";

  const uploadProfilePicture = async (e) => {
    e.preventDefault();
    if (picFile) {
      const data = new FormData();
      const fileName = Date.now() + picFile.name;
      data.append("name", fileName);
      data.append("file", picFile);
      try {
        await axios.post("http://localhost:8800/api/upload/profilePic", data, {
          headers: {
            authorization: token,
          },
        });
        setPicFile(null);
      } catch (error) {
        console.log(error);
      }
      try {
        await axios.put(
          `http://localhost:8800/api/users/${user._id}`,
          {
            userId: user._id,
            profilePicture: fileName,
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
        window.location.reload();
      } catch (error) {}
    }
  };

  const uploadCoverPicture = async (e) => {
    e.preventDefault();
    if (coverFile) {
      const data = new FormData();
      const fileName = Date.now() + coverFile.name;
      data.append("name", fileName);
      data.append("file", coverFile);
      try {
        await axios.post("http://localhost:8800/api/upload/coverPic", data, {
          headers: {
            authorization: token,
          },
        });
        setCoverFile(null);
      } catch (error) {
        console.log(error);
      }
      try {
        await axios.put(
          `http://localhost:8800/api/users/${user._id}`,
          {
            userId: user._id,
            coverPicture: fileName,
          },
          {
            headers: {
              authorization: token,
            },
          }
        );
        window.location.reload();
      } catch (error) {}
    }
  };
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <div className="coverContainer">
                {currentUser._id === params.id && (
                  <form>
                    <label htmlFor="coverPic">
                      <img
                        className="coverCamera"
                        src="/assets/person/camera.png"
                        alt="camera"
                      />
                    </label>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="coverPic"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => {
                        setCoverFile(e.target.files[0]);
                      }}
                    />
                    {coverFile && (
                      <button
                        className="uploadPic2"
                        onClick={uploadCoverPicture}
                      >
                        Upload
                      </button>
                    )}
                  </form>
                )}
              </div>
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + "cover/" + user.coverPicture
                    : "/assets/person/coverpic.jpg"
                }
                alt=""
              />

              <div className="forCamera">
                <img
                  className="profileUserImg"
                  src={
                    user.profilePicture
                      ? PF + "profile/" + user.profilePicture
                      : "/assets/person/no-image.jpg"
                  }
                  alt=""
                />
                {currentUser._id === params.id && (
                  <form className="cameraForm">
                    <label htmlFor="profilePic">
                      <img
                        className="profileCamera"
                        src="/assets/person/camera.png"
                        alt="camera"
                      />
                    </label>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="profilePic"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => {
                        setPicFile(e.target.files[0]);
                      }}
                    />
                    {picFile && (
                      <button
                        className="uploadPic"
                        onClick={uploadProfilePicture}
                      >
                        Upload
                      </button>
                    )}
                  </form>
                )}
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>

          <div className="profileRightBottom">
            <Feed profile id={user._id} />
            <Rightbar profile user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
