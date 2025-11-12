import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
// importing the Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";




const App = () => {
  return (
    <Router>
    
    

      {/* Page Content */}
     
        <Routes>
           <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
         
           
           </Route>

           <Route  element={<DashboardLayout/>}>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/course" element={<Course/>} />

           </Route>
        </Routes>
   

     
    </Router>
  );
};

export default App;
