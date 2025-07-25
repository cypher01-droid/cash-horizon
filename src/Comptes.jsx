import React, { useState } from 'react';
import './Comptes.css';

const Comptes = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Compte Courant', type: 'Courant', currency: 'EUR', balance: 2450.75 },
    { id: 2, name: 'Compte Épargne', type: 'Épargne', currency: 'XAF', balance: 10200.50 },
    { id: 3, name: 'Carte Visa', type: 'Carte', currency: 'USD', balance: 520.00 },
  ]);

  const [newAccount, setNewAccount] = useState({ name: '', type: '', currency: 'EUR', balance: '' });

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.type || !newAccount.balance) return;

    const newEntry = {
      ...newAccount,
      id: Date.now(),
      balance: parseFloat(newAccount.balance),
    };

    setAccounts([...accounts, newEntry]);
    setNewAccount({ name: '', type: '', currency: 'EUR', balance: '' });
  };

  const handleDeleteAccount = (id) => {
    const updated = accounts.filter(acc => acc.id !== id);
    setAccounts(updated);
  };

  const groupedAccounts = {
    Courant: accounts.filter(acc => acc.type === 'Courant'),
    Épargne: accounts.filter(acc => acc.type === 'Épargne'),
    Carte: accounts.filter(acc => acc.type === 'Carte'),
  };

  return (
    <div className="accounts-section">
      <h2 className="section-title">Mes Comptes</h2>

      <div className="account-group">
        {['Courant', 'Épargne', 'Carte'].map(type => (
          <div key={type} className="account-category">
            <h3>{type === 'Carte' ? 'Cartes Bancaires' : `Compte ${type}`}</h3>
            <div className="account-list">
              {groupedAccounts[type].map(acc => (
                <div key={acc.id} className="account-card">
                  <h4>{acc.name}</h4>
                  <p><strong>Type:</strong> {acc.type}</p>
                  <p><strong>Solde:</strong> {acc.balance.toFixed(2)} {acc.currency}</p>
                  <button onClick={() => handleDeleteAccount(acc.id)}>Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="account-form">
        <h3>Ajouter un Compte</h3>
        <input
          type="text"
          placeholder="Nom du compte"
          value={newAccount.name}
          onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
        />
        <select
          value={newAccount.type}
          onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
        >
          <option value="">Type</option>
          <option value="Courant">Courant</option>
          <option value="Épargne">Épargne</option>
          <option value="Carte">Carte</option>
        </select>
        <select
          value={newAccount.currency}
          onChange={(e) => setNewAccount({ ...newAccount, currency: e.target.value })}
        >
          <option value="EUR">EUR</option>
          <option value="XAF">XAF</option>
          <option value="USD">USD</option>
        </select>
        <input
          type="number"
          placeholder="Solde initial"
          value={newAccount.balance}
          onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
        />
        <button onClick={handleAddAccount}>Ajouter</button>
      </div>
    </div>
  );
};

export default Comptes;
