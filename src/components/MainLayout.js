import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Certifique-se de que o Sidebar está no mesmo diretório.
import { Container } from 'react-bootstrap';
import '../css/MainLayout.css'; // Certifique-se de importar o CSS correto

const MainLayout = () => {
  return (
    <div className="d-flex vh-100">
      {/* Menu Lateral */}
      <div className="sidebar">
        <Sidebar />
      </div>
      {/* Área principal */}
      <div className="main-content">
        <Container fluid>
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default MainLayout;
