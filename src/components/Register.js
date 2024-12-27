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
      <label>
        Username:
        <input
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
        />
      </label>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterUser;
