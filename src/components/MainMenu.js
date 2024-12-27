import React from 'react';
import { Link } from 'react-router-dom';
import '../MainMenu.css';

const MainMenu = () => {
  return (
    <div className="main-menu-container">
      <h1>Main Menu</h1>
      <div className="menu-options">
        <Link to="/create-request" className="menu-button">
          Create Request Form
        </Link>
        <Link to="/list-requests" className="menu-button">
          List Request Forms
        </Link>
        <Link to="/register" className="menu-button">
          Register User
        </Link>
      </div>
    </div>
  );
};

export default MainMenu;
