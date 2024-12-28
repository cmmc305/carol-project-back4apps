import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faList,
  faUser,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Parse from '../config/parseConfig';

import '../css/App.css';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="sidebar d-flex flex-column justify-content-between">
      <div>
        {/* Título ou Logo do seu sistema */}
        <h2 className="sidebar-title">My App</h2>
        
        {/* Navegação principal */}
        <Nav className="flex-column mt-4">
          <Nav.Link as={Link} to="/create-request">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Create Request
          </Nav.Link>
          <Nav.Link as={Link} to="/list-requests">
            <FontAwesomeIcon icon={faList} className="me-2" />
            List Requests
          </Nav.Link>
          <Nav.Link as={Link} to="/register">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Register User
          </Nav.Link>
        </Nav>
      </div>

      {/* Botão de logout posicionado na parte inferior */}
      <Button className="logout-btn mt-4" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;
