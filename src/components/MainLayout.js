import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Importa o menu fixo (sidebar)

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu Lateral */}
      <Sidebar />
      {/* Área principal */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
