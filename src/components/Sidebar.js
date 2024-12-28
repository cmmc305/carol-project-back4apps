import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/create-request">
          <FontAwesomeIcon icon={faPlus} /> Create Request
        </Nav.Link>
        <Nav.Link as={Link} to="/list-requests">
          <FontAwesomeIcon icon={faList} /> List Requests
        </Nav.Link>
        <Nav.Link as={Link} to="/register">
          <FontAwesomeIcon icon={faUser} /> Register User
        </Nav.Link>
      </Nav>
      <Button className="logout-btn mt-4" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
      </Button>
    </div>
  );
};

export default Sidebar;
