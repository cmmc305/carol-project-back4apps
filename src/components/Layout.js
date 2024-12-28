import React from 'react';
import SidebarMenu from './SidebarMenu';
import { Container, Row, Col } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <Row className="m-0 vh-100">
      <Col md={3} className="p-0">
        <SidebarMenu />
      </Col>
      <Col md={9} className="p-4">
        <Container>{children}</Container>
      </Col>
    </Row>
  );
};

export default Layout;
