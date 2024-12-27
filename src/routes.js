import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import Login from './components/Login';
import RegisterUser from './components/RegisterUser';

const routes = [
  { path: '/', element: <Login /> },
  { path: '/main-menu', element: <MainMenu /> },
  { path: '/create-request', element: <CaseRequestForm /> },
  { path: '/list-requests', element: <ListRequests /> },
  { path: '/update-request/:id', element: <CaseRequestForm /> },
  { path: '/register', element: <RegisterUser /> },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
