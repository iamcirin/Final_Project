import React from "react";
import "./post.css";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import Likes from "../likes/Likes";
import { FaTimesCircle, FaCommentDots } from "react-icons/fa";

const Post = ({ post, getHidedPost, home, profile }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [whoLiked, setWhoLiked] = useState([]);
  const [showList, setShowList] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [postDelete, setPostDelete] = useState(false);
  const { user: currentUser, token } = useContext(AuthContext);
  const textRef = useRef();
  const handleComment = () => {
    setShowComment(!showComment);
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/users/${post.userId}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setUser(res.data);
    };

    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      await axios.put(
        `/posts/${post._id}/like`,
        {
          userId: currentUser._id,
          hasBeenLikedId: post.userId,
          username: currentUser.username,
        },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } catch (error) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const sendComment = async () => {
    try {
      await axios.post("/comments", {
        userId: currentUser._id,
        username: currentUser.username,
        postId: post._id,
        userProfilePicture: currentUser.profilePicture,
        text: textRef.current.value,
      });
      // start
      const res = await axios.get(
        "http://localhost:8800/api/comments/" + post._id
      );
      setComments(res.data);
      //end
      textRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/comments/" + post._id
        );
        setComments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [post._id]);
  const showLikes = async () => {
    try {
      const res = await axios.get("/posts/likes/" + post._id);
      setWhoLiked(res.data);
      setShowList(true);
    } catch (error) {
      console.log(error);
    }
  };
  let t = useRef();

  const deletePost = () => {
    setPostDelete(true);

    t.current = setTimeout(async () => {
      // setPostDelete(false);
      await axios.delete("posts/delete/" + post._id);
      window.location.reload();
    }, 9000);
  };
  const restaurePost = () => {
    clearTimeout(t.current);
    setPostDelete(false);
    setShowMenu(false);
  };

  const hidePost = async () => {
    try {
      await axios.post("http://localhost:8800/api/posts/hide", {
        postId: post._id,
        userId: currentUser._id,
      });

      // window.location.reload();
      getHidedPost();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete("/comments/delete/" + id);
      const res = await axios.get(
        "http://localhost:8800/api/comments/" + post._id
      );
      setComments(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const params = useParams();

  const PF = "http://localhost:8800/images/";
  return (
    <div className="post">
      {!postDelete ? (
        <div>
          <div className="postWrapper">
            <div className="postTop">
              <div className="postTopLeft">
                <Link to={`profile/${post.userId}`}>
                  <img
                    className="postProfileImg"
                    src={
                      user.profilePicture
                        ? PF + "profile/" + user.profilePicture
                        : "/assets/person/no-image.jpg"
                    }
                    alt=""
                  />
                </Link>
                <span className="postUsername">{user.username}</span>
                <span className="postDate">{format(post.createdAt)}</span>
              </div>
              <div className="postTopRight">
                {(home || (profile && params.id === currentUser._id)) && (
                  <CgMoreVerticalAlt
                    className="vertical"
                    onClick={() => {
                      setShowMenu(!showMenu);
                    }}
                  />
                )}

                {showMenu && (
                  <div className="menuBar">
                    <ul className="ulList">
                      {/* { post.userId === currentUser._id ? <li>Delete Post</li> : <li>Hide post</li>} */}
                      <li
                        className={
                          post.userId === currentUser._id ? "list" : "blur"
                        }
                        onClick={() => {
                          if (post.userId === currentUser._id) {
                            deletePost();
                          }
                        }}
                      >
                        Delete post
                      </li>
                      <li
                        className={
                          post.userId !== currentUser._id
                            ? "list bordered"
                            : "blur bordered"
                        }
                        onClick={() => {
                          if (post.userId !== currentUser._id) {
                            hidePost();
                          }
                        }}
                      >
                        Hide post
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="postCenter">
              <span className="postText">{post.desc}</span>
              <img className="postImg" src={post.img && PF + post.img} alt="" />
            </div>
            <div className="postBottom">
              <div className="postBottomLeft">
                {/* <HiThumbUp className="likeIcon" onClick={likeHandler} /> */}
                {!isLiked ? (
                  <AiOutlineHeart className="heartIcon" onClick={likeHandler} />
                ) : (
                  <AiFillHeart className="heartIcon" onClick={likeHandler} />
                )}

                <span className="postLikeCounter" onClick={showLikes}>
                  {like} {like < 2 ? "person" : "people"} like it
                </span>
              </div>
              {/* // List of people who liked this post */}
              <div className={showList ? "showLikesList" : "likesList"}>
                <div className="topLikesList">
                  <div>People who liked this post</div>
                  <FaTimes
                    className="timesIcon"
                    onClick={() => setShowList(false)}
                  />
                </div>

                {whoLiked ? (
                  whoLiked.map((person) => {
                    return <Likes person={person} />;
                  })
                ) : (
                  <div>no person liked this post</div>
                )}
              </div>
              <div className="postBottomRight">
                <span onClick={handleComment} className="postCommentText">
                  {comments.length}{" "}
                  {comments.length < 2 ? "comment" : "comments"}
                  <FaCommentDots className="commentIcon" />
                </span>
              </div>
            </div>
          </div>
          {showComment && (
            <div className="commentWrapper">
              {comments &&
                comments.map((comment) => {
                  return (
                    <div key={comment._id} className="comment">
                      <img
                        className="commentImg"
                        src={
                          comment.userProfilePicture
                            ? PF + "profile/" + comment.userProfilePicture
                            : "/assets/person/no-image.jpg"
                        }
                        alt=""
                      />
                      <div className="commentBoxContainer">
                        <div className="commentText">
                          <div className="commentBox">
                            <b>{comment.username}</b>
                            <div className="text">{comment.text}</div>
                          </div>
                          {comment.userId === currentUser._id && (
                            <FaTimesCircle
                              className="dopdownIcon"
                              onClick={() => {
                                deleteComment(comment._id);
                              }}
                            />
                          )}
                        </div>
                        <div className="commentDate">
                          {format(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div className="commentInputContainer">
                <input
                  className="commentInput"
                  type="text"
                  placeholder="your comment"
                  ref={textRef}
                />
                <button className="commentBtn" onClick={sendComment}>
                  post
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="restauringContainer">
          <span>Post is going to be deleted in 5 seconds...</span>
          <button className="restauringBtn" onClick={restaurePost}>
            Restaure post
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
