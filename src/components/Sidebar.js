import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import Parse from '../config/parseConfig';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut(); // Faz o logout do usuário
      navigate('/'); // Redireciona para a página de login
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const navItems = [
    { path: '/create-request', label: 'Create Request Form' },
    { path: '/list-requests', label: 'List Requests' },
    { path: '/register', label: 'Register User' },
  ];

  return (
    <div className="d-flex flex-column bg-light vh-100 p-3 border-end">
      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Link
            as={Link}
            to={item.path}
            key={item.path}
            className={`mb-2 ${location.pathname === item.path ? 'active fw-bold text-primary' : ''}`}
          >
            {item.label}
          </Nav.Link>
        ))}
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
