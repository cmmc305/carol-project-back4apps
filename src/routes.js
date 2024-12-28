import React from 'react';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import Register from './components/Register';

const routes = [
  { path: '/', element: <Login /> },
  { path: '/main-menu', element: <MainMenu /> },
  { path: '/create-request', element: <CaseRequestForm /> },
  { path: '/list-requests', element: <ListRequests /> },
  { path: '/create-request/:id', element: <CaseRequestForm /> },
  { path: '/register', element: <Register /> },
];

export default routes;
