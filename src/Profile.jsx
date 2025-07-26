import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import {
  UserRound,
  CreditCard,
  Wallet,
  ArrowDownCircle,
  ArrowRight
} from 'lucide-react';

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
      <h2 className="welcome-text">
        <UserRound className="icon" /> Bienvenue, {user.name || 'Utilisateur'}
      </h2>

      <div className="overview-grid">
        <div className="overview-card">
          <div className="card-header">
            <CreditCard className="icon" />
            <h4>Comptes</h4>
          </div>
          <p>{accounts.length} compte(s)</p>
          <p><strong>Total:</strong> {totalBalance.toFixed(2)} €</p>
          <span className="status success">Actif</span>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <Wallet className="icon" />
            <h4>Budget</h4>
          </div>
          <p><strong>Défini:</strong> {budget} €</p>
          <p><strong>Dépensé:</strong> {totalSpent.toFixed(2)} €</p>
          <span className={`status ${totalSpent > budget ? 'danger' : 'ok'}`}>
            {totalSpent > budget ? 'Dépassement' : 'Stable'}
          </span>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <ArrowDownCircle className="icon" />
            <h4>Dernières Transactions</h4>
          </div>
          <ul className="tx-list">
            {transactions.map((tx, i) => (
              <li key={i}>
                <span>{tx.category || 'Autre'}</span>
                <span className="amount">-{tx.amount} €</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="overview-card quick-links">
          <div className="card-header">
            <ArrowRight className="icon" />
            <h4>Accès Rapide</h4>
          </div>
          <button onClick={() => window.scrollTo(0, 0)}>Voir Comptes</button>
          <button onClick={() => window.scrollTo(0, 0)}>Voir Transactions</button>
          <button onClick={() => window.scrollTo(0, 0)}>Voir Tableau Financier</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
