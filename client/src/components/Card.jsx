import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

import "./Card.css";

const Card = ({ video }) => {
  const formatDateAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    return formatDistanceToNow(createdDate, { addSuffix: true });
  };
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);
  return (
    <Link to={`/video/${video._id}`} className="card-link">
      <div className="card-container">
        <div className="card-details">
          <img
            className="card-thumbnail"
            src={`/videos/images/${video.imgUrl}`}
            alt="Video Thumbnail"
          />
          <div className="card-texts">
            <h1 className="card-title">{video.title}</h1>
            <div className="card-channel">
              <img
                className="card-channel-thumbnail"
                src={channel.img}
                alt="Channel Thumbnail"
              />
              <h2 className="card-channel-name">{channel.name}</h2>
            </div>
            <div className="card-info">
              {video.views} views - {formatDateAgo(video.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
