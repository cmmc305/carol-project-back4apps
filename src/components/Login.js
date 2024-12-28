import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from '../config/parseConfig';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
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
      navigate('/list-requests'); // Redireciona para a página inicial
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
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
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
          <Button
            type="submit"
            variant="primary"
            className="login-btn w-100"
            disabled={loading}
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
        </Form>
      </div>
    </div>
  );
};

export default Login;
