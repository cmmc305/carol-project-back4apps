import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import CaseRequestForm from './components/CaseRequestForm';
import ListRequests from './components/ListRequests';
import RegisterUser from './components/RegisterUser';
import './css/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login está fora do Layout */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas com o Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Routes>
                <Route path="/create-request" element={<CaseRequestForm />} />
                <Route path="/list-requests" element={<ListRequests />} />
                <Route path="/register" element={<RegisterUser />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
