import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Container } from 'react-bootstrap';
import '../css/MainLayout.css';

const MainLayout = () => {
  return (
    <div className="d-flex vh-100">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <Container fluid>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default MainLayout;
