import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const Recommendation = ({ currentVideo, tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  const filteredVideos = videos.filter(
    (video) => video._id !== currentVideo._id
  );

  return (
    <div className="Container">
      {filteredVideos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Recommendation;
