import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './MainLayout.css'; // Ensure you have a custom CSS file to manage layout

const MainLayout = ({ children, searchTerm, setSearchTerm }) => {
  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content wrapper */}
      <div>
        {/* Top navbar */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Content area */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
