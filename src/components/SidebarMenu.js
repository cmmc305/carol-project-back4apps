import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const SidebarMenu = () => {
  return (
    <div className="sidebar-menu bg-primary text-white">
      <h3 className="p-3">Main Menu</h3>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/create-request" className="text-white">
          Create Request Form
        </Nav.Link>
        <Nav.Link as={Link} to="/list-requests" className="text-white">
          List Request Forms
        </Nav.Link>
        <Nav.Link as={Link} to="/register" className="text-white">
          Register User
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SidebarMenu;
