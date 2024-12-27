import React, { useState } from 'react';
import Parse from '../config/parseConfig';
import '../Register.css';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const user = new Parse.User();
      user.set('username', formData.username);
      user.set('email', formData.email);
      user.set('password', formData.password);

      await user.signUp();
      setSuccess('User registered successfully!');
      setError('');
      setFormData({ username: '', email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Failed to register user');
      setSuccess('');
    }
  };

  return (
    <div className="register-user-container">
      <h1>Register User</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <label>
          Username:
          <input
            type="text"
            placeholder="Enter a username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="Enter a password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
        </label>
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
