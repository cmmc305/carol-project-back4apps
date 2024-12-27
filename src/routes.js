import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import UpdateRequest from './components/UpdateRequest';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';

const routes = [
  {
    path: '/',
    element: <Login />, // Tela inicial de login
  },
  {
    path: '/main-menu',
    element: <MainMenu />, // Menu principal
  },
  {
    path: '/create-request',
    element: <CaseRequestForm />, // Formulário para criar um request
  },
  {
    path: '/list-requests',
    element: <ListRequests />, // Página para listar requests
  },
  {
    path: '/update-request/:id',
    element: <UpdateRequest />, // Página para editar um request
  },
  {
    path: '/register',
    element: <RegisterUser />, // Página para registrar usuários
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
