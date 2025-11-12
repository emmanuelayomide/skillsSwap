import React from "react";
import "./Dashboard.css"
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar"; 


const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
     
      <Sidebar />
      <div className="dashboard-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default DashboardLayout;
