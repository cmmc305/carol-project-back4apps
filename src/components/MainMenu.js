import React from 'react';
import { Link } from 'react-router-dom';
import './MainMenu.css';

const MainMenu = () => {
  return (
    <div className="main-menu">
      <h1>Main Menu</h1>
      <ul>
        <li><Link to="/create-request">Create Request Form</Link></li>
        <li><Link to="/list-requests">List Request Forms</Link></li>
        <li><Link to="/update-request">Update Request Form</Link></li>
        <li><Link to="/register">Register User</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  );
};

export default MainMenu;
