import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="h-screen w-screen pt-[68px] pb-[92px]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
