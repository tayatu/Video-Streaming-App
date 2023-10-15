import React from "react";
import { useSelector } from "react-redux";

const ChannelDescription = ({ channel, handleSubscribe }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="Channel">
      <div className="ChannelInfo">
        <img
          className="Image"
          src={channel.img}
          alt="Channel Thumbnail"
        />
        <div className="ChannelDetail">
          <span className="ChannelName">{channel.name}</span>
          <p className="ChannelCounter">
             subscribers - {channel.subscribers}
          </p>
        </div>
      </div>
      {currentUser ? (
        <div className="Buttons">
          <button className="Subscribe" onClick={handleSubscribe}>
            {currentUser.subscribedChannels?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </button>
        </div>
      ) : (
        <span className="Message">Please log in to subscribe the channel.</span>
      )}
    </div>
  );
};

export default ChannelDescription;
