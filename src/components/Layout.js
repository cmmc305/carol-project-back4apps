import React from 'react';
import SidebarMenu from './SidebarMenu';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/App.css';
import '../css/Layout.css'; // Certifique-se de que o caminho do CSS está correto.


const Layout = ({ children }) => {
  return (
    <Row className="gx-0 vh-100">
      {/* Sidebar */}
      <Col md={3} className="bg-light border-end">
        <SidebarMenu />
      </Col>
      {/* Main Content */}
      <Col md={9} className="p-4">
        <Container fluid>{children}</Container>
      </Col>
    </Row>
  );
};

export default Layout;
