import React from 'react';
import ReactDOM from 'react-dom/client'; // Import correto para React 18+
import './css/App.css';  // Estilos globais (ou básicos) da aplicação
import './css/Login.css'; // Estilos específicos de Login (se necessário)
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
