import React from 'react';
import { Route } from 'react-router-dom';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import Register from './components/Register';

const routes = [
  { path: '/', element: <Login /> },
  { path: '/main-menu', element: <MainMenu /> },
  { path: '/create-request', element: <CaseRequestForm /> },
  { path: '/list-requests', element: <ListRequests /> },
  { path: '/create-request/:id', element: <CaseRequestForm /> },
  { path: '/register', element: <RegisterUser /> },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

export default router;
