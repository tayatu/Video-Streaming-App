import axios from "axios";
import React, { useEffect, useState } from "react";
import { subscription } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const SubscribedChannels = ({ currentVideo, tags }) => {
  const [channels, setChannels] = useState([]);
  const dispatch = useDispatch();

  const handleClick = async (channel) => {
    await axios.put(`/users/unsubscribe/${channel._id}`);
    dispatch(subscription(channel._id));
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await axios.get(`/users/subscribed-channels`);
      setChannels(res.data);
    };
    fetchChannels();
  }, [channels]);

  return (
    <div>
      {channels.map((channel) => (
        <div key={channel._id}>
          <img
            className="ChannelImage"
            src={channel.img}
            alt="Channel Thumbnail"
          />
          {channel.name}

          <button onClick={() => handleClick(channel)}>
            Unsubscribe the Channel
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscribedChannels;
