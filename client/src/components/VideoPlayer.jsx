import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

function VideoPlayer() {
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoPlayed, setvideoPlayed] = useState(false);

  const { currentVideo } = useSelector((state) => state.video);

  const videoQualities = [
    {
      label: "Low Quality",
      url: `/videos/mongo-video?videoId=${currentVideo._id}&quality=360p`,
    },
    {
      label: "Medium Quality",
      url: `/videos/mongo-video?videoId=${currentVideo._id}&quality=480p`,
    },
    {
      label: "High Quality",
      url: `/videos/mongo-video?videoId=${currentVideo._id}&quality=720p`,
    },
  ];

  const incrementViewCount = async () => {
    try {
      await axios.put(`/videos/view/${currentVideo._id}`);
      console.log("View count incremented");
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleQualityChange = (index) => {
    setSelectedQuality(index);
    setPlaying(false);
  };

  useEffect(() => {
    if (videoPlayed) {
      incrementViewCount();
    }
  }, [videoPlayed]);

  return (
    <div>
      <ReactPlayer
        url={videoQualities[selectedQuality].url}
        playing={playing}
        onPlay={() => {
          setPlaying(true);
          setvideoPlayed(true);
        }}
        onPause={() => setPlaying(false)}
        volume={1}
        controls={true}
        width="100%"
        height="100%"
        onError={(error) => console.error("Video error:", error)}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload",
            },
          },
        }}
      />
      <div>
        <p>Select video quality:</p>
        <ul>
          {videoQualities.map((quality, index) => (
            <li key={index}>
              <button
                onClick={() => handleQualityChange(index)}
                className={selectedQuality === index ? "selected" : ""}
              >
                {quality.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default VideoPlayer;
