// src/components/MainLayout/MainLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './MainLayout.module.css'; // Usando CSS Modules

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
