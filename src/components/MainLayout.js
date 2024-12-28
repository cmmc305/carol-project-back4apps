import React from 'react';
import Sidebar from './Sidebar'; // Certifique-se de que o Sidebar está no mesmo diretório.
import '../css/App.css';

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
