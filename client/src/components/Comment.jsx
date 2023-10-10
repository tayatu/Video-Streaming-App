import React, { useEffect, useState } from "react";
import "./Comment.css";
import axios from "axios";

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data);
    };
    fetchComment();
  }, [comment.userId]);

  return (
    <div className="channel-info">
      <img className="channel-avatar" src={channel.img} alt="Channel Avatar" />
      <div className="channel-details">
        <span className="channel-name">{channel.name}</span>
        <span className="comment-description">{comment.desc}</span>
      </div>
    </div>
  );
};

export default Comment;
