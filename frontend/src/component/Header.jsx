import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // icons
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        {/* The logo part*/}
        <div className="logo">
          <h2>SkillSwap</h2>
        </div>

        {/* the menu List */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/">Home</Link>
          <a href="/about">About</a>
          <a href="/login">Login</a>
          <Link to="/dashboard" > Dashboard</Link>
          <Link to="/register" className="btn-register">Register</Link>
        </nav>
        <div>
          <button>Access Dashboard</button>
        </div>

        {/* responsive menuy icon */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
