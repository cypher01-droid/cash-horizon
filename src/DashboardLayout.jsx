import React, { useState } from 'react';
import Profile from './Profile';
import Comptes from './Comptes';
import Transactions from './Transactions';
import FinanceBoard from './FinanceBoard';
import Transfers from './Transfers';
import './Dashboard.css';
import logo from './logo.png';
import {
  Home,
  Banknote,
  BarChart2,
  ListOrdered,
  Send,
  CircleDot
} from 'lucide-react';

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
          <div className="status-indicator">
            <CircleDot color="green" size={12} />
            <span className="status-text">En ligne</span>
          </div>
          <span>Bienvenue, {user?.name || 'Utilisateur'}</span>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="dashboard-body">
        <aside className="sidebar">
          <button onClick={() => setActiveSection('Profile')}>
            <Home size={16} style={{ marginRight: '6px' }} />
            Accueil
          </button>
          <button onClick={() => setActiveSection('Comptes')}>
            <Banknote size={16} style={{ marginRight: '6px' }} />
            Comptes
          </button>
          <button onClick={() => setActiveSection('FinanceBoard')}>
            <BarChart2 size={16} style={{ marginRight: '6px' }} />
            Finance
          </button>
          <button onClick={() => setActiveSection('Transactions')}>
            <ListOrdered size={16} style={{ marginRight: '6px' }} />
            Transactions
          </button>
          <button onClick={() => setActiveSection('Transfers')}>
            <Send size={16} style={{ marginRight: '6px' }} />
            Transferts
          </button>
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
