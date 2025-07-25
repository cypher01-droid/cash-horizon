import React from 'react';
import './Topbar.css';

const Topbar = () => {
  const fullName = localStorage.getItem('fullName') || 'Utilisateur';

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h3>Tableau de bord</h3>
      </div>
      <div className="topbar-right">
        <p>Bienvenue, <strong>{fullName}</strong></p>
      </div>
    </div>
  );
};

export default Topbar;
