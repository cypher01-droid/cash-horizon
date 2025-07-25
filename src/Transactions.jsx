import React, { useState } from 'react';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Dépense', label: 'Courses', amount: 45.90, date: '2025-07-21' },
    { id: 2, type: 'Revenu', label: 'Salaire', amount: 1500.00, date: '2025-07-01' },
    { id: 3, type: 'Dépense', label: 'Électricité', amount: 80.25, date: '2025-07-15' },
  ]);

  const [newTx, setNewTx] = useState({ label: '', amount: '', type: '', date: '' });
  const [filters, setFilters] = useState({ search: '', type: '', min: '', max: '' });

  const addTransaction = (e) => {
    e.preventDefault();
    const newTransaction = {
      ...newTx,
      id: Date.now(),
      amount: parseFloat(newTx.amount),
    };
    setTransactions([newTransaction, ...transactions]);
    setNewTx({ label: '', amount: '', type: '', date: '' });
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.label.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.type || tx.type === filters.type;
    const matchesMin = !filters.min || tx.amount >= parseFloat(filters.min);
    const matchesMax = !filters.max || tx.amount <= parseFloat(filters.max);
    return matchesSearch && matchesType && matchesMin && matchesMax;
  });

  return (
    <div className="transactions-section">
      <h2 className="section-title">Historique des Transactions</h2>

      <form className="transaction-form" onSubmit={addTransaction}>
        <input
          type="text"
          placeholder="Libellé"
          value={newTx.label}
          onChange={(e) => setNewTx({ ...newTx, label: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Montant"
          value={newTx.amount}
          onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
          required
        />
        <select
          value={newTx.type}
          onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
          required
        >
          <option value="">Type</option>
          <option value="Revenu">Revenu</option>
          <option value="Dépense">Dépense</option>
        </select>
        <input
          type="date"
          value={newTx.date}
          onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher par libellé"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Tous les types</option>
          <option value="Revenu">Revenu</option>
          <option value="Dépense">Dépense</option>
        </select>
        <input
          type="number"
          placeholder="Min €"
          value={filters.min}
          onChange={(e) => setFilters({ ...filters, min: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max €"
          value={filters.max}
          onChange={(e) => setFilters({ ...filters, max: e.target.value })}
        />
      </div>

      <div className="transaction-list">
        {filteredTransactions.length === 0 ? (
          <p className="empty">Aucune transaction trouvée.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className={`transaction-card ${tx.type === 'Dépense' ? 'depense' : 'revenu'}`}>
              <h4>{tx.label}</h4>
              <p className="amount">
                {tx.type === 'Dépense' ? '-' : '+'} €{tx.amount.toFixed(2)}
              </p>
              <p className="date">{tx.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
