import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import Register from './components/Register';
import './css/App.css'; // Certifique-se de que o caminho do CSS está correto.

const App = () => (
  <Router>
    <Routes>
      {/* Página de login não usa o MainLayout */}
      <Route path="/" element={<Login />} />
      {/* Páginas protegidas (com menu fixo) */}
      <Route element={<MainLayout />}>
        <Route path="/create-request" element={<CaseRequestForm />} />
        <Route path="/list-requests" element={<ListRequests />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
