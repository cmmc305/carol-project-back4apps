import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import UpdateRequest from './components/UpdateRequest';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/create-request" element={<CaseRequestForm />} />
        <Route path="/list-requests" element={<ListRequests />} />
        <Route path="/update-request" element={<UpdateRequest />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
