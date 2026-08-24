import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fafaf8] pt-20 text-gray-900 transition-colors duration-1500 ease-in-out">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
