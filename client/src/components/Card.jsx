import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

// import "./Card.css";

const Card = ({ video }) => {
  const formatDateAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    return formatDistanceToNow(createdDate, { addSuffix: true });
  };
  const [channel, setChannel] = useState({});

  console.log(video.imgUrl);

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await axios.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);
  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <div className="Container">
        <div className="Details">
          <img
            style={{ width: "200px", height: "150px" }} // Adjust the width and height as needed
            className="ChannelImage"
            src={`/videos/images/${video.imgUrl}`}
            alt="Channel Thumbnail"
          />

          <div className="Texts">
            <h1 className="Title">{video.title}</h1>
            <img
              className="ChannelImage"
              src={channel.img}
              alt="Channel Thumbnail"
            />
            <h2 className="ChannelName">{channel.name}</h2>
            <div className="Info">
              {video.views} views - {formatDateAgo(video.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
