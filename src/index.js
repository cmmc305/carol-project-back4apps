import React from 'react';
import ReactDOM from 'react-dom/client'; // Import da nova API para renderização
import './index.css';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root')); // Criando o root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
