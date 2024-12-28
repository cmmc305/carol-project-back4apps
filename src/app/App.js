import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import MainLayout from '../components/MainLayout';
import CaseRequestForm from '../components/CaseRequestForm';
import ListRequests from '../components/ListRequests';
import RegisterUser from '../components/Register';

const App = () => (
  <Router>
    <Routes>
      {/* Página de login não usa o MainLayout */}
      <Route path="/" element={<Login />} />
      {/* Páginas protegidas (com menu fixo) */}
      <Route element={<MainLayout />}>
        <Route path="/create-request" element={<CaseRequestForm />} />
        <Route path="/list-requests" element={<ListRequests />} />
        <Route path="/register" element={<RegisterUser />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
