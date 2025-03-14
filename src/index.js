// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap primeiro
import './css/App.css'; // Seus estilos globais
import './components/Sidebar/Sidebar.module.css'; // Estilos do Sidebar via CSS Modules
// Outros estilos específicos já são importados nos componentes correspondentes

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
