import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Card from '../components/Card';

const UploadedVideos = () => {
  const [videos, setVideos] = useState([]);

  const handleDelete = async (videoId) => {
    await axios.delete(`/videos/${videoId}`);

    const updatedVideos = videos.filter((video) => { return video._id !== videoId});
    setVideos(updatedVideos)
  };

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/uploaded-videos`);
      setVideos(res.data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="Container">
      {videos.map((video) => (
        <div>
          <Card key={video._id} video={video} />
          <button onClick={() => handleDelete(video._id)}>Delete the Video</button>
        </div>
      ))}
    </div>
  )
}

export default UploadedVideos