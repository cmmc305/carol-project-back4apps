import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/Sidebar.css';
import '../css/App.css';

const MainLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <div className="container-main">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
