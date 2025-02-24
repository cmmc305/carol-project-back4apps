// src/components/Sidebar/Sidebar.js

import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faList,
  faUser,
  faSignOutAlt,
  faFileAlt, // Novo ícone para Document Analysis
} from '@fortawesome/free-solid-svg-icons';
import Parse from '../../config/parseConfig';
import styles from './Sidebar.module.css'; // Usando CSS Modules

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      navigate('/'); // Redireciona para a página de login
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  // Definindo os links da Sidebar, agora incluindo "Document Analysis"
  const navLinks = [
    {
      to: '/app/create-request',
      label: 'Create Request',
      icon: faPlus,
    },
    {
      to: '/app/list-requests',
      label: 'List Requests',
      icon: faList,
    },
    {
      to: '/app/register',
      label: 'Register User',
      icon: faUser,
    },
    {
      to: '/app/document-analysis', // Novo link para Document Analysis
      label: 'Document Analysis',
      icon: faFileAlt,
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>CaseApp</h2>
      </div>
      <Nav className="flex-column">
        {navLinks.map((link) => (
          <Nav.Link
            as={Link}
            to={link.to}
            key={link.to}
            className={`${styles.navLink} ${
              location.pathname === link.to ? styles.active : ''
            }`}
          >
            <FontAwesomeIcon icon={link.icon} className={styles.icon} />
            <span className={styles.label}>{link.label}</span>
          </Nav.Link>
        ))}
      </Nav>
      <Button className={styles.logoutBtn} onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
        <span className={styles.label}>Logout</span>
      </Button>
    </div>
  );
};

export default Sidebar;
