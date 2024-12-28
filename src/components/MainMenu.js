import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/App.css';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>Main Menu</h1>
      <Row className="mt-4">
        <Col md={4}>
          <Button
            variant="primary"
            className="w-100 mb-3"
            onClick={() => navigate('/create-request')}
          >
            Create Request Form
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="success"
            className="w-100 mb-3"
            onClick={() => navigate('/list-requests')}
          >
            List Request Forms
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="info"
            className="w-100 mb-3"
            onClick={() => navigate('/register')}
          >
            Register User
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MainMenu;