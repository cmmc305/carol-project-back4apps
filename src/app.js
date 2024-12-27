import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import UpdateRequestForm from './components/UpdateRequestForm';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Página inicial - Login */}
        <Route path="/" element={<Login />} />

        {/* Menu principal */}
        <Route path="/main-menu" element={<MainMenu />} />

        {/* Criar Request */}
        <Route path="/create-request" element={<CaseRequestForm />} />

        {/* Listar Requests */}
        <Route path="/list-requests" element={<ListRequests />} />

        {/* Atualizar Request */}
        <Route path="/update-request/:id" element={<UpdateRequestForm />} />

        {/* Página não encontrada */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
