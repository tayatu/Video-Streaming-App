// Sidebar.js
import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <Link to="/trends" style={{ textDecoration: "none" }}>
          <button className="sidebar-button">Trending</button>
        </Link>

        {currentUser && (
          <Link to="/subscribed" style={{ textDecoration: "none" }}>
            <button className="sidebar-button">Subscribed Videos</button>
          </Link>
        )}

        {currentUser && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="sidebar-button">Upload Video</button>
          </Link>
        )}
        {currentUser && (
          <Link to="/subscribers" style={{ textDecoration: "none" }}>
            <button className="sidebar-button">Subscriber List</button>
          </Link>
        )}
        {currentUser && (
          <Link to="/subscribed-channels" style={{ textDecoration: "none" }}>
            <button className="sidebar-button">Subscribed List</button>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
