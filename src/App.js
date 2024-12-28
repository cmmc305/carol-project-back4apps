import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import dos componentes
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import Register from './components/Register';

// Import global de CSS (se preferir, pode manter seu reset/global em outro lugar)
import './css/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login não utiliza o MainLayout */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas protegidas (ou que utilizam o layout principal) */}
        <Route element={<MainLayout />}>
          <Route path="/create-request" element={<CaseRequestForm />} />
          <Route path="/list-requests" element={<ListRequests />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
