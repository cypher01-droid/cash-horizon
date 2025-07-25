import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import DashboardLayout from './DashboardLayout';
import HorizonBot from './HorizonBot'; // ✅ Import HorizonBot

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>

      {/* ✅ AI assistant is rendered globally */}
      <HorizonBot />
    </Router>
  );
};

export default App;
