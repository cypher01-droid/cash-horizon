import React, { useState } from 'react';
import './Comptes.css';
import {
  CreditCard,
  PiggyBank,
  Building2,
  Trash2
} from 'lucide-react';

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

  const getAccountIcon = (type) => {
    if (type === 'Courant') return <Building2 size={20} />;
    if (type === 'Épargne') return <PiggyBank size={20} />;
    if (type === 'Carte') return <CreditCard size={20} />;
    return null;
  };

  return (
    <div className="accounts-section">
      <h2 className="section-title">💼 Mes Comptes</h2>

      <div className="account-group">
        {['Courant', 'Épargne', 'Carte'].map(type => (
          <div key={type} className="account-category">
            <h3>
              {type === 'Carte' ? '💳 Cartes Bancaires' : `🏦 Compte ${type}`}
            </h3>
            <div className="account-list">
              {groupedAccounts[type].map(acc => (
                <div key={acc.id} className="account-card">
                  <div className="account-header">
                    <div className="account-icon">{getAccountIcon(acc.type)}</div>
                    <h4>{acc.name}</h4>
                  </div>
                  <p><strong>Type:</strong> {acc.type}</p>
                  <p>
                    <strong>Solde:</strong>{' '}
                    <span className={acc.balance > 0 ? 'positive-balance' : 'negative-balance'}>
                      {acc.balance.toFixed(2)} {acc.currency}
                    </span>
                  </p>
                  <button className="delete-btn" onClick={() => handleDeleteAccount(acc.id)}>
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="account-form">
  <h3>🏦 Choisissez votre banque</h3>

  <div className="bank-grid">
    {[
      { name: 'UBA', logo: '/logos/uba.png', type: 'Courant', currency: 'XAF' },
      { name: 'Ecobank', logo: '/logos/ecobank.png', type: 'Courant', currency: 'XAF' },
      { name: 'BNP Paribas', logo: '/logos/bnp.jpeg', type: 'Épargne', currency: 'EUR' },
      { name: 'Société Générale', logo: '/logos/sg.png', type: 'Courant', currency: 'EUR' },
      { name: 'GTBank', logo: '/logos/gtbank.png', type: 'Carte', currency: 'XAF' },
      { name: 'Bank of Africa', logo: '/logos/boa.png', type: 'Épargne', currency: 'XAF' },
    ].map(bank => (
      <div
        key={bank.name}
        className={`bank-card ${newAccount.name === bank.name ? 'selected' : ''}`}
        onClick={() => setNewAccount({ ...newAccount, ...bank })}
      >
        <img src={bank.logo} alt={bank.name} />
        <p>{bank.name}</p>
      </div>
    ))}
  </div>

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
