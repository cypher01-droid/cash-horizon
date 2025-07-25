import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setActiveSection }) => {
  return (
    <div className="sidebar">
      <h2 className="logo">Cash Horizon</h2>
      <ul className="sidebar-menu">
        <li onClick={() => setActiveSection('accounts')}>Comptes</li>
        <li onClick={() => setActiveSection('transactions')}>Transactions</li>
        <li onClick={() => setActiveSection('finance')}>Tableau de bord</li>
        <li onClick={() => setActiveSection('transfers')}>Transferts</li>
        <li onClick={() => setActiveSection('profile')}>Profil</li>
        <li onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}>Déconnexion</li>
      </ul>
    </div>
  );
};

export default Sidebar;
