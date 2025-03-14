// src/components/Register/Register.js

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Table, Modal } from 'react-bootstrap';
import Parse from '../../config/parseConfig'; // Make sure your Parse config is correct
import styles from './Register.module.css'; // Your CSS Module for styling

const RegisterUser = () => {
  // State for registration form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // State for user management
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all registered users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new Parse.Query(Parse.User);
      const results = await query.find();
      setUsers(results);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
    }
    setLoading(false);
  };

  // Handle input changes in registration form
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Register a new user
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const user = new Parse.User();
      user.set('username', formData.username);
      user.set('email', formData.email);
      user.set('password', formData.password);
      await user.signUp();
      setSuccess("User registered successfully!");
      setFormData({ username: '', email: '', password: '' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error registering user:", err);
      setError(err.message || "Failed to register user.");
    }
    setLoading(false);
  };

  // Open modal for updating password
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  // Close the password modal
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
  };

  // Handle password update for a user
  const handleChangePassword = async () => {
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      selectedUser.set('password', newPassword);
      await selectedUser.save();
      setSuccess("Password updated successfully!");
      closePasswordModal();
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password.");
    }
    setLoading(false);
  };

  // Open modal for deleting a user
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Close the delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Handle deletion of a user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!window.confirm(`Are you sure you want to delete user ${selectedUser.get('username')}? This action cannot be undone.`)) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      await selectedUser.destroy();
      setSuccess("User deleted successfully!");
      closeDeleteModal();
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
    setLoading(false);
  };

  return (
    <Container className={styles.registerContainer}>
      <h1 className={`text-center ${styles.title}`}>User Registration & Management</h1>

      {/* Registration Form */}
      <div className={styles.formBox}>
        <h2 className={styles.subtitle}>Register New User</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleRegister}>
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
            <Button variant="primary" type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  /> Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </div>
        </Form>
      </div>

      {/* User List */}
      <div className={styles.userListBox}>
        <h2 className={styles.subtitle}>Registered Users</h2>
        {loading && (
          <div className="mb-3 text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {users.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th style={{ width: "30%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.get('username')}</td>
                  <td>{user.get('email')}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => openPasswordModal(user)} className="me-2">
                      Change Password
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => openDeleteModal(user)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">No users found.</Alert>
        )}
      </div>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={closePasswordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>New Password for {selectedUser ? selectedUser.get('username') : ''}</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePasswordModal}>Cancel</Button>
          <Button variant="primary" onClick={handleChangePassword} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user <strong>{selectedUser ? selectedUser.get('username') : ''}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
            {loading ? "Deleting..." : "Delete User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RegisterUser;
