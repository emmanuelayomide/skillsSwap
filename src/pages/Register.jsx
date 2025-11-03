import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import "./Register.css";
import RegisterImg from "../assets/register.jpg"; // replace with your own image

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);
  };

  return (
    <div className="register-container">
      {/* Left Image Section */}
      <div className="register-image">
        <img src={RegisterImg} alt="Register" />
      </div>

      {/* Right Form Section */}
      <div className="register-form">
        <h2>Create Your Account</h2>
        <p>Join SkillSwap and start learning or teaching today!</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Sign Up <ArrowRight size={16} />
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
