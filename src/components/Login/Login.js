// src/components/Login/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Parse from '../../config/parseConfig';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import styles from './Login.module.css'; // Importa o CSS Module

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
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <Form onSubmit={handleLogin} className={styles.form}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label className={styles.label}>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className={styles.label}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
          <Button
            type="submit"
            variant="primary"
            className={`${styles.submitButton} w-100`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
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
