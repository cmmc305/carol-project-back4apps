import React from 'react';
import { Outlet } from 'react-router-dom'; // Certifique-se de importar o Outlet
import Sidebar from './Sidebar'; // Certifique-se de que o Sidebar está no mesmo diretório.
import { Container, Row, Col } from 'react-bootstrap';
import '../css/App.css';

const MainLayout = () => {
  return (
    <div className="d-flex vh-100">
      {/* Menu Lateral */}
      <div className="bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
        <Sidebar />
      </div>
      {/* Área principal */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Container fluid>
          <Row>
            <Col>
              <Outlet />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MainLayout;
