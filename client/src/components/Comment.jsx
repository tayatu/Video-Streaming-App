import React, { useEffect, useState } from "react";
// import "./Comment.css"
import axios from "axios";


const Comment = ({comment}) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(`/users/find/${comment.userId}`);
      setChannel(res.data)
    };
    fetchComment();
  }, [comment.userId]);


  return (
    <div className="Container">
      <img className="Avatar" src={channel.img} />
      <div className="Details">
        <span className="Name">
        {channel.name}
        </span>
        <span className="Text">
        {comment.desc}
        </span>
      </div>
    </div>
  );
};

export default Comment;
