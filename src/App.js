// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import './css/App.css'; // Importando estilos globais

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
