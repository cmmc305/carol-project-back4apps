import React from 'react';
import { Outlet } from 'react-router-dom';
import Login from './components/Login';
import MainLayout from './components/MainLayout'; // Sidebar + Layout principal
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import Register from './components/Register';

const routes = [
  // Rota de login (fora do layout principal)
  { path: '/', element: <Login /> },

  // Rotas protegidas (dentro do layout principal)
  {
    element: <MainLayout />, // Aplica o layout com a sidebar
    children: [
      { path: '/create-request', element: <CaseRequestForm /> },
      { path: '/create-request/:id', element: <CaseRequestForm /> },
      { path: '/list-requests', element: <ListRequests /> },
      { path: '/register', element: <Register /> },
    ],
  },
];

export default routes;
