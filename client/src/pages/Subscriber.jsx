import axios from "axios";
import React, { useEffect, useState } from "react";
import { remove_subscriber } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Subscribers = ({ currentVideo, tags }) => {
  const [subscribers, setSubscribers] = useState([]);
  const dispatch = useDispatch();

  const handleClick = async (channelId) => {
    await axios.put(`/users/remove-subscriber/${channelId}`);
    dispatch(remove_subscriber(channelId));
    const updatedSubscriber = subscribers.filter((subscribed_channel) => { return subscribed_channel._id !== channelId});
    setSubscribers(updatedSubscriber)
  };

  useEffect(() => {
    const fetchsubscriber = async () => {
      const res = await axios.get(`/users/subscribers`);
      setSubscribers(res.data);
    };
    fetchsubscriber();
  }, []);

  return (
    <div>
      {subscribers.map((subscriber) => (
        <div key={subscriber._id} className="channel-card">
          <img
            className="channel-image"
            src={subscriber.img}
            alt="Channel Thumbnail"
          />
          <div className="channel-details">{subscriber.name}</div>
          <button onClick={() => handleClick(subscriber._id)}>
            Remove the subscriber
          </button>
        </div>
      ))}
    </div>
  );
};
export default Subscribers;
