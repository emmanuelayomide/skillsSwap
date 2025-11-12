// Sidebar.jsx

import React, { useState } from 'react';
import './Sidebar.css';
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  BarChart3,
  Calendar,
  Settings,
  HelpCircle,
  Pencil,
  Crown,
} from 'lucide-react';



const Sidebar = () => {
  const handleClick = (clickedItem) => {
    setNavItems((prevItems) =>
      prevItems.map((item) =>
        item.name === clickedItem.name
          ? { ...item, current: true }
          : { ...item, current: false }
      )
    );
  };



  const [navItems, setNavItems] = useState([
    { name: "Dashboard", icon: LayoutDashboard, current: true },
    { name: "Course", icon: BookOpen, current: false },
    { name: "My Task", icon: ClipboardList, current: false },
     { name: 'Community', icon: Users, current: false },
  { name: 'Report', icon: BarChart3, current: false },
  { name: 'Events', icon: Calendar, current: false },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Hamburger/Close Button */}
      <button
        className="mobile-menu-button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="sidebar-navigation"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <nav
        id="sidebar-navigation"
        className={`sidebar-container ${isOpen ? 'open' : ''}`}
        aria-label="Main Navigation"
      >
        <div className="sidebar-header">
          <Pencil size={24} className="logo-icon" />
          <span className="logo-text">SkilSwap</span>
          {/* Close button visible only on mobile when menu is open */}
          <button className="close-button" onClick={toggleMenu} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

          <div className="nav-section main-nav">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={`${item.name.toLowerCase().replace(' ', '-')}`}
          className={`nav-item ${item.current ? 'current' : ''}`}
          aria-current={item.current ? 'page' : undefined}
          onClick={() => handleClick(item)}
        >
          <item.icon size={20} />
          <span className="nav-text">{item.name}</span>
        </a>
      ))}
    </div>

        <div className="nav-section utility-nav">
          <a href="#settings" className="nav-item">
            <Settings size={20} />
            <span className="nav-text">Setting</span>
          </a>
          <a href="#support" className="nav-item">
            <HelpCircle size={20} />
            <span className="nav-text">Support</span>
          </a>
        </div>

        {/* Premium Upgrade Section */}
        <div className="upgrade-premium-card">
          <div className="icon-badge">
            <Crown size={24} color="#FFD700" fill="#FFD700" />
          </div>
          <p className="upgrade-text">
            **Upgrade Premium**
            <br />
            Get exclusive access, advanced tools, and support
          </p>
          <button className="get-premium-button">Get Premium</button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;