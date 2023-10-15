import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../redux/userSlice";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./Navbar.css";
const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [q, setQ] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" style={{ textDecoration: "none" }}>
          <button className="button ">Home</button>
        </Link>

        <Link to="/trends" style={{ textDecoration: "none" }}>
          <button className="button ">Trending</button>
        </Link>

        {currentUser && (
          <Link to="/subscribed" style={{ textDecoration: "none" }}>
            <button className="button ">Subscribed Videos</button>
          </Link>
        )}

        {currentUser && (
          <Link to="/upload" style={{ textDecoration: "none" }}>
            <button className="button ">Upload Video</button>
          </Link>
        )}

        {currentUser && (
          <Link to="/uploaded-videos" style={{ textDecoration: "none" }}>
            <button className="button ">Uploaded Videos</button>
          </Link>
        )}
        {currentUser && (
          <Link to="/subscribers" style={{ textDecoration: "none" }}>
            <button className="button ">Subscriber List</button>
          </Link>
        )}
        {currentUser && (
          <Link to="/subscribed-channels" style={{ textDecoration: "none" }}>
            <button className="button ">Subscribed List</button>
          </Link>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="search-button"
            onClick={() => navigate(`/search?query=${q}`)}
          >
            Search
          </button>
        </div>

        {currentUser ? (
          <div className="User">
            <img className="ProfileAvatar" src={currentUser.img} />
            {currentUser.name}

            <Link to="/" style={{ textDecoration: "none" }}>
              <button className="logout-button" onClick={handleLogout}>
                Log Out{" "}
              </button>
            </Link>
          </div>
        ) : (
          <Link to="signin" style={{ textDecoration: "none" }}>
            <button className="sign-in-button">Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
