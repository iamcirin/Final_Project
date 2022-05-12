import React, { useState, useEffect, useRef } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Feed = ({ home, profile, id }) => {
  const [posts, setPosts] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [afterPosts, setAfterPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = profile
        ? await axios.get("http://localhost:8800/api/posts/profile/" + id, {
            headers: {
              authorization: token,
            },
          })
        : await axios.get(
            "http://localhost:8800/api/posts/timeline/" + user._id,
            {
              headers: {
                authorization: token,
              },
            }
          );
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };

    fetchPosts();
  }, [id, user._id]);

  useEffect(() => {
    // const editedPosts = JSON.parse(localStorage.getItem("allEntries"));

    // const newPosts = posts.filter((post) => {
    //   return editedPosts.indexOf(post._id) === -1;
    // });
    const getHidedPost = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/posts/hide/" + user._id
        );
        const array = res.data.map((el) => {
          return el.postId;
        });
        // console.log(array);

        const newPosts = posts.filter((post) => {
          return array.indexOf(post._id) === -1;
        });

        setAfterPosts(
          newPosts.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    getHidedPost();
  }, [posts, user]);
  const getHidedPost2 = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8800/api/posts/hide/" + user._id
      );
      const array = res.data.map((el) => {
        return el.postId;
      });
      // console.log(array);

      const newPosts = posts.filter((post) => {
        return array.indexOf(post._id) === -1;
      });

      setAfterPosts(
        newPosts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(home || user._id === id) && <Share />}

        {(afterPosts.length > 0 ? afterPosts : posts).map((post) => {
          return (
            <Post
              home={home}
              profile={profile}
              key={post._id}
              post={post}
              getHidedPost={getHidedPost2}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
