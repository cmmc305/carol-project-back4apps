import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualizado para usar createRoot no React 18
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Adiciona o estilo global do Bootstrap
import './css/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
