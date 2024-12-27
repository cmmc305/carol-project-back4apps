import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MainMenu from './components/MainMenu';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/create-request" element={<CaseRequestForm />} />
        <Route path="/list-requests" element={<ListRequests />} />
        {/* Outras rotas aqui */}
      </Routes>
    </Router>
  );
};

export default App;
