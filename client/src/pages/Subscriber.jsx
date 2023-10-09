import axios from "axios";
import React, { useEffect, useState } from "react";
import { subscription } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Subscribers = ({ currentVideo, tags }) => {
  const [subscribers, setSubscribers] = useState([]);
  const dispatch = useDispatch();


  const handleClick = async (channel) =>{
    await axios.put(`/users/unsubscribe/${channel._id}`)
    dispatch(subscription(channel._id));
  }

  useEffect(() => {
    const fetchsubscriber = async () => {
      const res = await axios.get(`/users/subscribers`);
      setSubscribers(res.data);
    };
    fetchsubscriber();
  }, [subscribers]);

  return (
    <div>
      {subscribers.map((channel) => (
        <div key={channel._id}>
            {channel.name}
        </div>
      ))}
      
    </div>
  );
};

export default Subscribers;
