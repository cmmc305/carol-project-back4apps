import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from '../config/parseConfig';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import '../css/App.css';
import '../css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await Parse.User.logIn(username, password);
      navigate('/main-menu'); // Redireciona para o Main Menu
    } catch (err) {
      if (err.code === 101) {
        setError('Invalid username or password');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center mb-4">Login</h1>
          <Form onSubmit={handleLogin} className="p-4 shadow bg-white rounded">
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{' '}
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
