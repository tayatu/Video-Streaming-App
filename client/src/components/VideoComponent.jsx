import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

const VideoDescription = ({
  currentVideo,
  isLiked,
  handleLike,
  handleShare,
}) => {
  const { currentUser } = useSelector((state) => state.user);

  const formatDateAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    return formatDistanceToNow(createdDate, { addSuffix: true });
  };

  return (
    <div>
      <div className="Title">{currentVideo.title}</div>
      <div className="Details">
        <span className="Info">
          {currentVideo.views} views - {formatDateAgo(currentVideo.createdAt)} -{" "}
          {currentVideo.likes} Likes - {currentVideo.shareCount} Shares-
        </span>
        {currentUser ? (
          <div className="Buttons">
            <button className="Button" onClick={handleLike}>
              {isLiked ? "Unlike" : "Like"}
            </button>
            <button className="Button" onClick={handleShare}>
              Share
            </button>
          </div>
        ) : (
          <span className="Message">
            Please log in to like and share the video.
          </span>
        )}
      </div>
      <p className="Description">{currentVideo.desc}</p>
    </div>
  );
};

export default VideoDescription;
