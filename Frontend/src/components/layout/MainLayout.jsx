import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./MainLayout.css";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="layout">
      {/* Sidebar backdrop for mobile only */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      
      <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />
      
      <div className="main">
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isOpen} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;