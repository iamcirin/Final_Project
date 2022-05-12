import axios from "axios";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Online from "../online/Online";
import "./rightbar.css";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AiOutlineUserAdd } from "react-icons/ai";
import { HiUserRemove } from "react-icons/hi";

const Rightbar = ({ profile, user }) => {
  const PF = "http://localhost:8800/images/";
  const { user: currentUser, dispatch, token } = useContext(AuthContext);

  const HomeRightbar = () => {
    const [followers, setFollowers] = useState([]);
    useEffect(() => {
      const getFollowers = async () => {
        const res = await axios.get(
          "http://localhost:8800/api/users/followers/" + currentUser._id
        );
        setFollowers(res.data);
      };
      getFollowers();
    }, [currentUser._id]);
    return (
      <>
        <div className="birthdayContainer">
          <img
            className="birthdayImg"
            src="/assets/person/present.svg"
            alt=""
          />
          <span className="birthdayText">
            <b>Birthdays</b> and <b>Events </b>
          </span>
        </div>
        <div className="ads">
          <img
            className="rightbarAd"
            src="/assets/person/starbucks.png"
            alt=""
          />
          <span className="adText">ads</span>
        </div>
        <h4 className="rightbarTitle">Followers</h4>
        <ul className="rightbarFriendList">
          {followers.map((follower) => {
            return <Online key={follower._id} follower={follower} />;
          })}
        </ul>
      </>
    );
  };
  const ProfileRightbar = () => {
    const params = useParams();
    const [friends, setFriends] = useState([]);
    const [followed, setFollowed] = useState(
      currentUser.following.includes(params.id)
    );
    const [showEdit, setShowEdit] = useState(false);
    const [Current, setCurrent] = useState({});

    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get(
            `http://localhost:8800/api/users/friends/${params.id}`,
            {
              headers: {
                authorization: token,
              },
            }
          );
          setFriends(friendList.data);
        } catch (error) {
          console.log(error);
        }
      };
      getFriends();
    }, [params.id]);

    const handleClick = async () => {
      try {
        if (followed) {
          await axios.put(
            "http://localhost:8800/api/users/" + params.id + "/unfollow",
            {
              userId: currentUser._id,
            },
            {
              headers: {
                authorization: token,
              },
            }
          );
          dispatch({ type: "UNFOLLOW", payload: params.id });
        } else {
          await axios.put(
            "http://localhost:8800/api/users/" + params.id + "/follow",
            {
              userId: currentUser._id,
              followerName: currentUser.username,
            },
            {
              headers: {
                authorization: token,
              },
            }
          );
          dispatch({ type: "FOLLOW", payload: params.id });
        }
      } catch (error) {
        console.log(error);
      }
      setFollowed(!followed);
    };
    const cityRef = useRef();
    const countryRef = useRef();
    const relationRef = useRef();

    const handleEdit = async () => {
      setShowEdit(!showEdit);
      if (showEdit) {
        try {
          await axios.put("http://localhost:8800/api/users/" + params.id, {
            userId: params.id,
            city: cityRef.current.value,
            from: countryRef.current.value,
            relationship: relationRef.current.value,
          });
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    };
    useEffect(() => {
      const editedUser = async () => {
        try {
          const res = await axios.get(
            "http://localhost:8800/api/users/" + params.id
          );
          setCurrent(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      editedUser();
    }, [currentUser._id]);
    return (
      <div className="userInfoBar">
        {params.id !== currentUser._id && (
          <button onClick={handleClick} className="rightbarFollowButton">
            {followed ? "Unfollow" : "Follow"}
            {followed ? (
              <HiUserRemove className="followIcon" />
            ) : (
              <AiOutlineUserAdd className="followIcon" />
            )}
          </button>
        )}
        <div className="profileRightbarContainer">
          <h4 className="rightbarTitle">Information</h4>
          {params.id === currentUser._id && (
            <button className="editBtn" onClick={handleEdit}>
              {!showEdit ? "Edit" : "Save"}
            </button>
          )}
        </div>
        <div className="rightbarInfo">
          {!showEdit ? (
            <div className="rightbarInfoFirst">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Email:</span>
                <span className="rightbarInfoValue">{user.email}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <span className="rightbarInfoValue">{Current.city}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <span className="rightbarInfoValue">{Current.from}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <span className="rightbarInfoValue">
                  {Current.relationship === 1
                    ? "Single"
                    : Current.relationship === 2
                    ? "Married"
                    : "-"}
                </span>
              </div>
            </div>
          ) : (
            <div className="rightbarInfoSecond">
              <form className="rightbarForm" action="">
                <label htmlFor="city">City</label>
                <input
                  className="inp"
                  type="text"
                  id="city"
                  placeholder="City"
                  ref={cityRef}
                />
                <label htmlFor="from">From</label>
                <input
                  className="inp"
                  type="text"
                  id="from"
                  placeholder="Country"
                  ref={countryRef}
                />

                <label htmlFor="relation">Relationship</label>
                <div className="miniCon">
                  <input
                    className="inp"
                    type="number"
                    id="relation"
                    min="1"
                    max="2"
                    ref={relationRef}
                    onChange={(e) => {
                      if (e.currentTarget.value > 2) {
                        e.currentTarget.value = 2;
                      } else if (e.currentTarget.value < 0) {
                        e.currentTarget.value = 1;
                      }
                    }}
                  />
                  <span> 1: Single || 2 : Married</span>
                </div>
              </form>
            </div>
          )}
        </div>
        <h4 className="rightbarTitle">Followings</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => {
            return (
              <Link
                to={`/profile/${friend._id}`}
                key={friend._id}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? PF + "profile/" + friend.profilePicture
                        : "/assets/person/no-image.jpg"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
