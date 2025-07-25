import React, { useState } from 'react';
import Profile from './Profile';
import Comptes from './Comptes';
import Transactions from './Transactions';
import FinanceBoard from './FinanceBoard';
import Transfers from './Transfers';
import './Dashboard.css';
import logo from './logo.png';

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState('Profile');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="top-nav">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <h2 className="logo-text">Cash Horizon</h2>
        </div>
        <div className="user-info">
          <span>Bienvenue, {user?.name || 'Utilisateur'}</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="dashboard-body">
        <aside className="sidebar">
          <button onClick={() => setActiveSection('Profile')}>Accueil</button>
          <button onClick={() => setActiveSection('Comptes')}>Comptes</button>
          <button onClick={() => setActiveSection('FinanceBoard')}>Finance</button>
          <button onClick={() => setActiveSection('Transactions')}>Transactions</button>
          <button onClick={() => setActiveSection('Transfers')}>Transferts</button>
        </aside>

        <main className="dashboard-content">
          {activeSection === 'Profile' && <Profile />}
          {activeSection === 'Comptes' && <Comptes />}
          {activeSection === 'Transactions' && <Transactions />}
          {activeSection === 'FinanceBoard' && <FinanceBoard />}
          {activeSection === 'Transfers' && <Transfers />}
        </main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} Cash Horizon. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
