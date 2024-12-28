import React from 'react';
import ReactDOM from 'react-dom/client'; // Import correto para React 18+
import App from './App';
import './css/Login.css'; // Ajuste conforme necessário para incluir estilos globais.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
