import React, { useEffect, useState } from "react";
import Comments from "../components/Comments";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchSuccess, like, share, unlike } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import VideoDescription from "../components/VideoComponent";
import ChannelDescription from "../components/ChannelDescription";
import Recommendation from "../components/Recommandation";
import VideoPlayer from "../components/VideoPlayer";
import "./Video.css";

const Video = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const [isLiked, setIsLiked] = useState(false);

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  const handleLike = async () => {
    try {
      if (!isLiked) {
        await axios.post(`/videos/like/${currentVideo._id}`);
        dispatch(like());
      } else {
        await axios.post(`/videos/unlike/${currentVideo._id}`);
        dispatch(unlike());
        console.log(isLiked);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleShare = async () => {
    await axios.put(`/videos/share/${currentVideo._id}`);
    dispatch(share(channel._id));
  };

  const handleSubscribe = async () => {
    currentUser.subscribedChannels.includes(channel._id)
      ? await axios.put(`/users/unsubscribe/${channel._id}`)
      : await axios.put(`/users/subscribe/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoInfo = await axios.get(`/videos/find/${path}`);
        const channelInfo = await axios.get(
          `/users/find/${videoInfo.data.userId}`
        );
        const isLikedResponse = await axios.get(
          `/videos/is-liked/${videoInfo.data._id}`
        );

        setCurrentVideo(videoInfo.data);
        setIsLoading(false);
        setChannel(channelInfo.data);
        setIsLiked(isLikedResponse.data.isLiked);

        dispatch(fetchSuccess(videoInfo.data));
      } catch (err) {}
    };
    fetchData();
  }, [path, dispatch]);

  return (
    <div className="video-page">
      {!isLoading && currentVideo ? (
        <div className="video-page">
          <div className="video-container">
            <div className="video-player">
              <VideoPlayer src="mount-video" />
            </div>

            <VideoDescription
              currentVideo={currentVideo}
              isLiked={isLiked}
              handleLike={handleLike}
              handleShare={handleShare}
            />
            <hr className="divider" />

            <ChannelDescription
              channel={channel}
              handleSubscribe={handleSubscribe}
            />

            <Comments videoId={currentVideo._id} />
            <hr className="divider"></hr>
          </div>
          <div className="recommendation">
            <Recommendation
              currentVideo={currentVideo}
              tags={currentVideo.tags}
            />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Video;

