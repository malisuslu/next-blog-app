import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className=" h-fit w-screen pt-[68px] pb-8">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
