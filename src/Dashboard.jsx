import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const Sidebar = () => (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li><button onClick={() => setActiveSection('profile')}>Profil</button></li>
        <li><button onClick={() => setActiveSection('accounts')}>Comptes</button></li>
        <li><button onClick={() => setActiveSection('transactions')}>Transactions</button></li>
        <li><button onClick={() => setActiveSection('finance')}>Tableau Financier</button></li>
        <li><button onClick={() => setActiveSection('transfers')}>Transferts</button></li>
        <li><button onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}>Déconnexion</button></li>
      </ul>
    </div>
  );

  const Topbar = () => (
    <div className="topbar">
      <h2>Cash Horizon</h2>
      <p>Bienvenue, <strong>{localStorage.getItem('fullName')}</strong></p>
    </div>
  );

  // Profile section
  const Profile = () => {
    const [user, setUser] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [budget, setBudget] = useState(0);
    const userId = localStorage.getItem('userId');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
          setUser(userRes.data);
  
          const accRes = await axios.get(`http://localhost:5000/api/accounts/${userId}`);
          setAccounts(accRes.data);
  
          const txRes = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
          setTransactions(txRes.data.slice(-3).reverse());
  
          const budgetRes = await axios.get(`http://localhost:5000/api/budget/${userId}`);
          setBudget(budgetRes.data.amount);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchData();
    }, [userId]);
  
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  
    return (
      <div className="profile-dashboard">
        <h2>Bienvenue, {user.name || 'Utilisateur'}</h2>
  
        <div className="overview-grid">
          <div className="overview-card">
            <h4>Comptes</h4>
            <p>{accounts.length} compte(s)</p>
            <p>Total: {totalBalance.toFixed(2)} €</p>
          </div>
  
          <div className="overview-card">
            <h4>Budget</h4>
            <p>Défini: {budget} €</p>
            <p>Dépensé: {totalSpent.toFixed(2)} €</p>
          </div>
  
          <div className="overview-card">
            <h4>Dernières Transactions</h4>
            <ul className="tx-list">
              {transactions.map((tx, i) => (
                <li key={i}>
                  {tx.category || 'Autre'}: -{tx.amount} €
                </li>
              ))}
            </ul>
          </div>
  
          <div className="overview-card quick-links">
            <h4>Accès Rapide</h4>
            <button onClick={() => window.scrollTo(0, 0)}>Voir Comptes</button>
            <button onClick={() => window.scrollTo(0, 0)}>Voir Transactions</button>
            <button onClick={() => window.scrollTo(0, 0)}>Voir Tableau Financier</button>
          </div>
        </div>
      </div>
    );
  };

  const Accounts = () => {
    const [accounts, setAccounts] = useState([
      { id: 1, name: 'Compte Courant', type: 'Courant', balance: 2450.75 },
      { id: 2, name: 'Compte Épargne', type: 'Épargne', balance: 10200.50 },
    ]);
    const [newAccount, setNewAccount] = useState({ name: '', type: '', balance: '' });
  
    const handleAddAccount = () => {
      if (!newAccount.name || !newAccount.type || !newAccount.balance) return;
  
      const newEntry = {
        ...newAccount,
        id: Date.now(),
        balance: parseFloat(newAccount.balance),
      };
  
      setAccounts([...accounts, newEntry]);
      setNewAccount({ name: '', type: '', balance: '' });
    };
  
    const handleDeleteAccount = (id) => {
      const updated = accounts.filter(acc => acc.id !== id);
      setAccounts(updated);
    };
  
    return (
      <div className="accounts-section">
        <h3>Comptes Bancaires</h3>
  
        <div className="account-list">
          {accounts.map((acc) => (
            <div key={acc.id} className="account-card">
              <h4>{acc.name}</h4>
              <p>Type: {acc.type}</p>
              <p>Solde: € {acc.balance.toFixed(2)}</p>
              <button onClick={() => handleDeleteAccount(acc.id)}>Supprimer</button>
            </div>
          ))}
        </div>
  
        <div className="account-form">
          <h4>Ajouter un Compte</h4>
          <input
            type="text"
            placeholder="Nom du compte"
            value={newAccount.name}
            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type (ex: Courant)"
            value={newAccount.type}
            onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
          />
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
        id: transactions.length + 1,
        amount: parseFloat(newTx.amount)
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
        <h3>Transactions</h3>
  
        {/* Add New Transaction */}
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
  
        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Rechercher"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Tous</option>
            <option value="Revenu">Revenu</option>
            <option value="Dépense">Dépense</option>
          </select>
          <input
            type="number"
            placeholder="Min"
            value={filters.min}
            onChange={(e) => setFilters({ ...filters, min: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max}
            onChange={(e) => setFilters({ ...filters, max: e.target.value })}
          />
        </div>
  
        {/* List */}
        <div className="transaction-list">
          {filteredTransactions.length === 0 ? (
            <p>Aucune transaction trouvée.</p>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="transaction-card">
                <h4>{tx.label}</h4>
                <p>{tx.type} • €{tx.amount.toFixed(2)}</p>
                <p>{tx.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  const FinanceBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [inputBudget, setInputBudget] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const userId = localStorage.getItem('userId');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const txRes = await axios.get(`http://localhost:5000/api/transactions/${userId}`);
      setTransactions(txRes.data);

      const budgetRes = await axios.get(`http://localhost:5000/api/budget/${userId}`);
      setBudget(budgetRes.data.amount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/budget', { userId, amount: inputBudget });
      setBudget(inputBudget);
      setInputBudget('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', {
        userId,
        label,
        amount: parseFloat(amount),
        category,
        date,
      });
      setLabel('');
      setAmount('');
      setCategory('');
      setDate('');
      fetchData(); // Refresh transactions
    } catch (err) {
      console.error(err);
    }
  };

  // Group by category
  const categoryData = transactions.reduce((acc, tx) => {
    const cat = tx.category || 'Autre';
    acc[cat] = (acc[cat] || 0) + tx.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const totalSpent = pieData.reduce((sum, entry) => sum + entry.value, 0);
  const remaining = budget - totalSpent;

  return (
    <div>
      <h3>Tableau Financier</h3>

      {/* Budget Form */}
      <form onSubmit={handleBudgetSubmit} className="form-grid">
        <label>Budget mensuel (€):</label>
        <input
          type="number"
          value={inputBudget}
          onChange={(e) => setInputBudget(e.target.value)}
          required
        />
        <button type="submit">Définir</button>
      </form>

      {/* Transaction Form */}
      <h4>Ajouter une Transaction</h4>
      <form onSubmit={handleTransactionSubmit} className="form-grid">
        <input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} required />
        <input type="number" placeholder="Montant" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input placeholder="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">Ajouter</button>
      </form>

      {/* Budget Summary */}
      <p>Total Dépensé: {totalSpent.toFixed(2)} €</p>
      <p>Budget Défini: {budget} €</p>
      <p>Reste: {remaining.toFixed(2)} €</p>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const Transfers = () => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userPhone = localStorage.getItem('userPhone');
  
    const [showSend, setShowSend] = useState(false);
    const [showReceive, setShowReceive] = useState(false);
  
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
  
    const [receiveAccount, setReceiveAccount] = useState('');
  
    useEffect(() => {
      const fetchAccounts = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/accounts/${userId}`);
          setAccounts(res.data);
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchAccounts();
    }, [userId]);
  
    const handleSend = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/api/transfer', {
          senderId: userId,
          recipient,
          amount,
          fromAccountId: selectedAccount
        });
        alert('Transfert réussi');
        setRecipient('');
        setAmount('');
        setSelectedAccount('');
        setShowSend(false);
      } catch (err) {
        console.error(err);
        alert('Erreur lors du transfert');
      }
    };
  
    return (
      <div className="section-container">
        <h3>Transferts</h3>
  
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => { setShowSend(true); setShowReceive(false); }}>Envoyer</button>
          <button onClick={() => { setShowReceive(true); setShowSend(false); }} style={{ marginLeft: '1rem' }}>Recevoir</button>
        </div>
  
        {showSend && (
          <form onSubmit={handleSend} className="transfer-form">
            <label>Envoyer à (ID, Email ou Téléphone):</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
  
            <label>Montant (€):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
  
            <label>Compte source:</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="">Sélectionner</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} — {acc.balance} €
                </option>
              ))}
            </select>
  
            <button type="submit">Envoyer</button>
          </form>
        )}
  
        {showReceive && (
          <div className="receive-panel">
            <p><strong>ID:</strong> <span onClick={() => navigator.clipboard.writeText(userId)}>{userId}</span></p>
            <p><strong>Email:</strong> <span onClick={() => navigator.clipboard.writeText(userEmail)}>{userEmail}</span></p>
            <p><strong>Téléphone:</strong> <span onClick={() => navigator.clipboard.writeText(userPhone)}>{userPhone}</span></p>
  
            <label>Compte de réception:</label>
            <select
              value={receiveAccount}
              onChange={(e) => setReceiveAccount(e.target.value)}
            >
              <option value="">Sélectionner</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} — {acc.balance} €
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };
  
  
  const renderSection = () => {
    switch (activeSection) {
      case 'accounts': return <Accounts />;
      case 'transactions': return <Transactions />;
      case 'finance': return <FinanceBoard />;
      case 'transfers': return <Transfers />;
      case 'profile':
      default: return <Profile />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-dashboard">
        <Topbar />
        <div className="dashboard-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
