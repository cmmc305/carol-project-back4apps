import React, { useState } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import Parse from '../../config/parseConfig'; // CORRETO
import styles from './Register.module.css'; // Usando CSS Modules

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = new Parse.User();
      user.set('username', formData.username);
      user.set('email', formData.email);
      user.set('password', formData.password);

      await user.signUp();
      setSuccess('User registered successfully!');
      setFormData({ username: '', email: '', password: '' });

      setTimeout(() => setSuccess(''), 5000); // Oculta a mensagem de sucesso após 5 segundos
    } catch (err) {
      setError(err.message || 'Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register User</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter a password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{' '}
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterUser;
