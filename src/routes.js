// src/routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout/MainLayout';
import Login from './components/Login/Login';
import RegisterUser from './components/Register/Register';
import CaseRequestForm from './components/CaseRequestForm/CaseRequestForm';
import ListRequests from './components/ListRequests/ListRequests';
import DocumentAnalysis from './components/DocumentAnalysis/DocumentAnalysis'; // Importa o componente novo
import NotFound from './components/NotFound/NotFound';

const AppRoutes = () => (
  <Routes>
    {/* Rota de Login */}
    <Route path="/" element={<Login />} />

    {/* Rotas com MainLayout */}
    <Route path="/app" element={<MainLayout />}>
      <Route path="register" element={<RegisterUser />} />
      <Route path="create-request" element={<CaseRequestForm />} />
      <Route path="create-request/:id" element={<CaseRequestForm />} />
      <Route path="list-requests" element={<ListRequests />} />
      <Route path="document-analysis" element={<DocumentAnalysis />} />
      <Route path="*" element={<NotFound />} />
    </Route>

    {/* Rota 404 para rotas públicas */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
