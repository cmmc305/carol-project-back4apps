import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import Parse from '../config/parseConfig';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut(); // Faz o logout do usuário
      navigate('/'); // Redireciona para a página de login
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column bg-light vh-100 p-3">
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/create-request">Create Request Form</Nav.Link>
        <Nav.Link as={Link} to="/list-requests">List Requests</Nav.Link>
        <Nav.Link as={Link} to="/register">Register User</Nav.Link>
      </Nav>
      <div className="mt-auto">
        <Button variant="danger" onClick={handleLogout} className="w-100">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
