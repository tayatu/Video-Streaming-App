import React, { useEffect, useState } from "react";

import "./Comments.css"
import Comment from "./Comment";
import { useSelector } from "react-redux";
import axios from "axios";

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(0);
  const [commentDescription, setCommentDescription] = useState("");

  const handleCommentChange = (e) => {
    setCommentDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`/comments`, { "desc": commentDescription , videoId });

      setCommentDescription("");

      const res = await axios.get(`/comments/${videoId}`);
      setComments(res.data);


    } catch (err) {}
  };

  const fetchComments = async () => {
    try {

      const res = await axios.get(`/comments/${videoId}?commentsLoaded=${commentsLoaded}`);

      setComments(res.data);
      setCommentsLoaded(res.data.length);

      console.log(commentsLoaded);
    } catch (err) {}
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div className>
      {currentUser ? (
        <div className="NewComment">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={commentDescription}
              placeholder="Add a comment..."
              onChange={handleCommentChange}
            />
            <button type="submit">Comment</button>
          </form>
        </div>
      ) : (
        <span >Please log in to comment.</span>
      )}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
      <button onClick={fetchComments}>Load More Comments</button>
    </div>
  );
};

export default Comments;
