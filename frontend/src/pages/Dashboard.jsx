import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, LogOut, Rocket } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
        console.log(user)
      } catch (err) {
        setError("Failed to fetch profile. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* ✅ NAVBAR */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <Rocket size={22} color="#2563eb" />
          <h2>SkillSwap</h2>
        </div>

        <div className="nav-right">
          <p>Hi, <span>{user?.name}</span> 👋</p>
          <button className="logout-nav" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* ✅ DASHBOARD BODY */}
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>Welcome Back, {user?.name}! 👋</h2>
          <p>Your personal SkillSwap dashboard</p>
        </div>

        <div className="user-info">
          <div className="info-item">
            <User size={18} />
            <span>{user?.name}</span>
          </div>

          <div className="info-item">
            <Mail size={18} />
            <span>{user?.email}</span>
          </div>

          <div className="info-item">
            <Calendar size={18} />
            <span>Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* ✅ PROMO SECTION */}
      <div className="promo-section">
        <h3>🔥 Recommended For You</h3>
        <p>Learn a new skill today and grow your career with SkillSwap.</p>
        <div className="promo-cards">
          <div className="promo-card">
            <h4>💻 Web Development</h4>
            <p>Master React, Node.js, and more with top-rated mentors.</p>
          </div>
          <div className="promo-card">
            <h4>🎨 Design Skills</h4>
            <p>Boost your creativity with UI/UX and graphic design lessons.</p>
          </div>
          <div className="promo-card">
            <h4>📈 Marketing</h4>
            <p>Learn how to promote your skills and grow your brand.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
