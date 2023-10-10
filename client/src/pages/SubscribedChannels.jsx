import axios from "axios";
import React, { useEffect, useState } from "react";
import { subscription } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import './SubscribedChannel.css'

const SubscribedChannels = ({ currentVideo, tags }) => {
  const [channels, setChannels] = useState([]);
  const dispatch = useDispatch();

  const handleUnsubscribe = async (channelId) => {
    await axios.put(`/users/unsubscribe/${channelId}`);
    dispatch(subscription(channelId));
    const updatedChannels = channels.filter((subscribed_channel) => { return subscribed_channel._id !== channelId});
    setChannels(updatedChannels)
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await axios.get(`/users/subscribed-channels`);
      setChannels(res.data);
    };
    fetchChannels();
  }, []);

  console.log(channels);

  return (
    <div>
      {channels.map((channel) => (
        <div key={channel._id} className="channel-card">
          <img className="channel-image" src={channel.img} alt="Channel Thumbnail" />
          <div className="channel-details">
            <p className="user-name">{channel.name}</p>
          </div>
          <button onClick={() => handleUnsubscribe(channel._id)}>Unsubscribe the Channel</button>
        </div>
      ))}
    </div>
  );
};

export default SubscribedChannels;
