import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import "./Login.css";
import LoginImg from "../assets/login.jpg"; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Logged In:", formData);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={LoginImg} alt="login" className="login-img" />
          <h2>Welcome Back</h2>
          <p>Log in to continue your SkillSwap journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Log In <LogIn size={16} />
          </button>
        </form>

        <p className="register-link">
          Don’t have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
