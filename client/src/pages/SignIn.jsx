// SignIn.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";

// import "./SignIn.css";

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/signin", { name, password });
      console.log(res.data);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch {
      dispatch(loginFailure());
    }
  };
  return (
    <div className="container">
      <div className="wrapper">
        <h1 className="title">Sign in</h1>
        <h2 className="subtitle">to continue to LamaTube</h2>
        <input
          className="input"
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" onClick={handleLogin}>
          Sign in
        </button>

        <h1 className="title">or</h1>
        <input
          className="input"
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button">Sign up</button>

        
      </div>
    </div>
  );
};

export default SignIn;
