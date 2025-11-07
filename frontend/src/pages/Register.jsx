import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import "./Register.css";
import RegisterImg from "../assets/register.jpg";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountstatus, setAccountstatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword || formData.password.length<=7 ) {
      return setError("Passwords do not match and must be 8 above length");
    } else if(formData.name==="" || formData.email===""){
      return setError("Username/Email Field can't be Empty")
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",{name: formData.name, email: formData.email,password: formData.password,}
      );

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      setAccountstatus(response.data.message)

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image">
        <img src={RegisterImg} alt="Register" />
      </div>

      <div className="register-form">
        <h2>Create Your Account</h2>
        <p>Join SkillSwap and start learning or teaching today!</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            
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

          {error && <p className="error">{error}</p>}
          {accountstatus? alert(accountstatus): ""}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating account..." : <>Sign Up <ArrowRight size={16} /></>}
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
