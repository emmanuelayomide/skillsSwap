import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";


// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";


const App = () => {
  return (
    <Router>
    
      <Header />

      {/* Page Content */}
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
           <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </main>

 
      <Footer />
    </Router>
  );
};

export default App;
