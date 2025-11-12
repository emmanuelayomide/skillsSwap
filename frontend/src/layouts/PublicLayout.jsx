import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
